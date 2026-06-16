from flask import Flask, jsonify
from flask_cors import CORS
from api.routes import bp as api_bp
from pathlib import Path
from analysis import cleaning, feature_engineering, prediction

app = Flask(__name__)
CORS(app)
app.register_blueprint(api_bp, url_prefix='/api')


@app.route('/')
def index():
    return jsonify({'status':'Student Performance Analytics API', 'endpoints': ['/api/students','/api/analytics','/api/top-performers','/api/grades','/api/prediction']})


if __name__ == '__main__':
    # ensure model trained on startup (non-blocking for demo)
    data_path = Path(__file__).resolve().parent / 'data' / 'students.csv'
    df = cleaning.load_data(data_path)
    df = cleaning.clean_data(df)
    df = feature_engineering.add_features(df)
    try:
        score = prediction.train_and_save_model(df)
        print('Model trained, test score:', score)
    except Exception as e:
        print('Model training skipped or failed:', e)
    app.run(host='0.0.0.0', port=5000, debug=True)
