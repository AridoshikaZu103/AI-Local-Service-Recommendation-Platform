from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import re
import math

app = Flask(__name__)
CORS(app)

analyzer = SentimentIntensityAnalyzer()


# ──────────────────────────────────────────────
#  Health Check Endpoint
# ──────────────────────────────────────────────
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'NearNest AI Engine',
        'version': '1.0.0',
        'endpoints': ['/analyze', '/extract_intent', '/rank', '/health']
    })


# ──────────────────────────────────────────────
#  Sentiment Analysis Endpoint (existing)
# ──────────────────────────────────────────────
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    scores = analyzer.polarity_scores(text)
    compound = scores['compound']

    if compound >= 0.05:
        sentiment = 'Positive'
    elif compound <= -0.05:
        sentiment = 'Negative'
    else:
        sentiment = 'Neutral'

    return jsonify({
        'sentiment': sentiment,
        'scores': scores
    })


# ──────────────────────────────────────────────
#  Intent Extraction Endpoint (existing)
# ──────────────────────────────────────────────
@app.route('/extract_intent', methods=['POST'])
def extract_intent():
    data = request.json
    text = data.get('text', '').lower()

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # Expanded category synonyms for smarter matching
    category_synonyms = {
        'ac repair': ['ac', 'air conditioner', 'air conditioning', 'cooling', 'ac repair', 'ac service', 'ac fix'],
        'electrician': ['electrician', 'electric', 'wiring', 'electrical', 'light', 'switch', 'circuit'],
        'plumber': ['plumber', 'plumbing', 'pipe', 'leak', 'tap', 'drain', 'water leak'],
        'salon': ['salon', 'haircut', 'beauty', 'spa', 'grooming', 'facial', 'hair'],
        'tutor': ['tutor', 'tutoring', 'teaching', 'teacher', 'coaching', 'math', 'study', 'class'],
        'maid': ['maid', 'cleaning', 'cleaner', 'housekeeping', 'housekeeper', 'domestic'],
        'mechanic': ['mechanic', 'car repair', 'bike repair', 'vehicle', 'garage', 'auto'],
        'water purifier': ['water purifier', 'ro', 'water filter', 'purifier', 'ro service']
    }

    locations = ['mumbai', 'delhi', 'bangalore', 'hyderabad', 'pune', 'chennai']

    found_category = None
    found_location = None

    # Fuzzy synonym matching for categories
    for cat, synonyms in category_synonyms.items():
        for synonym in synonyms:
            if synonym in text:
                found_category = cat
                break
        if found_category:
            break

    for loc in locations:
        if loc in text:
            found_location = loc
            break

    return jsonify({
        'category': found_category,
        'location': found_location
    })


# ──────────────────────────────────────────────
#  AI Trust Score Ranking Endpoint (NEW - Day 2)
# ──────────────────────────────────────────────
@app.route('/rank', methods=['POST'])
def rank_services():
    """
    Computes a composite AI Trust Score for each service.
    
    Formula:
      ai_score = (W_rating * norm_rating) +
                 (W_volume * norm_volume) +
                 (W_sentiment * sentiment_ratio) +
                 (W_verified * verified_bonus)
    
    Weights: rating=0.40, volume=0.25, sentiment=0.25, verified=0.10
    
    Input JSON:
      { "services": [ { "name", "rating", "reviewCount", "is_verified", "sentimentBreakdown": { "positive": N, "total": N } }, ... ] }
    
    Returns:
      { "ranked": [ { ...service, "ai_score": 0.0-1.0 }, ... ] }  sorted descending
    """
    data = request.json
    services = data.get('services', [])

    if not services:
        return jsonify({'ranked': []}), 200

    # Weights
    W_RATING = 0.40
    W_VOLUME = 0.25
    W_SENTIMENT = 0.25
    W_VERIFIED = 0.10

    # Find max review count for log normalization
    max_reviews = max(s.get('reviewCount', 0) for s in services)
    log_max = math.log(max_reviews + 1) if max_reviews > 0 else 1

    ranked = []
    for s in services:
        # 1. Normalize rating (0-5 -> 0-1)
        norm_rating = min(s.get('rating', 0), 5) / 5.0

        # 2. Log-normalize review volume (prevents large counts from dominating)
        review_count = s.get('reviewCount', 0)
        norm_volume = math.log(review_count + 1) / log_max if log_max > 0 else 0

        # 3. Sentiment ratio (positive reviews / total reviews)
        sentiment_data = s.get('sentimentBreakdown', {})
        positive = sentiment_data.get('positive', 0)
        total = sentiment_data.get('total', 0)
        sentiment_ratio = positive / total if total > 0 else 0.5  # neutral default

        # 4. Verified bonus
        verified_bonus = 1.0 if s.get('is_verified', False) else 0.0

        # Composite score
        ai_score = (
            (W_RATING * norm_rating) +
            (W_VOLUME * norm_volume) +
            (W_SENTIMENT * sentiment_ratio) +
            (W_VERIFIED * verified_bonus)
        )

        # Round to 3 decimal places
        ai_score = round(ai_score, 3)

        service_copy = dict(s)
        service_copy['ai_score'] = ai_score
        ranked.append(service_copy)

    # Sort by ai_score descending (deterministic: tie-break by rating, then name)
    ranked.sort(key=lambda x: (-x['ai_score'], -x.get('rating', 0), x.get('name', '')))

    return jsonify({'ranked': ranked})


if __name__ == '__main__':
    app.run(debug=True, port=5001)
