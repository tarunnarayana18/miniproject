from flask import Blueprint, jsonify, request
from analysis import cleaning, feature_engineering, eda, prediction
from pathlib import Path

bp = Blueprint('api', __name__)

DATA_PATH = Path(__file__).resolve().parents[1] / 'data' / 'students.csv'


@bp.route('/students')
def students():
    df = cleaning.load_data(DATA_PATH)
    df = cleaning.clean_data(df)
    df = feature_engineering.add_features(df)
    return jsonify(df.to_dict(orient='records'))


@bp.route('/analytics')
def analytics():
    df = cleaning.load_data(DATA_PATH)
    df = cleaning.clean_data(df)
    df = feature_engineering.add_features(df)
    result = {
        'subject_averages': eda.subject_averages(df),
        'attendance': eda.attendance_stats(df),
        'grade_distribution': eda.grade_distribution(df)
    }
    return jsonify(result)


@bp.route('/top-performers')
def top_performers():
    n = int(request.args.get('n', 5))
    df = cleaning.load_data(DATA_PATH)
    df = cleaning.clean_data(df)
    df = feature_engineering.add_features(df)
    return jsonify(eda.top_performers(df, n))


@bp.route('/grades')
def grades():
    df = cleaning.load_data(DATA_PATH)
    df = cleaning.clean_data(df)
    df = feature_engineering.add_features(df)
    return jsonify(df[['Student_ID','Student_Name','Grade','Average']].to_dict(orient='records'))


@bp.route('/prediction', methods=['POST'])
def predict():
    data = request.get_json()
    # Expect Math, Science, English, Attendance
    try:
        grade = prediction.predict_grade(data)
        return jsonify({'predicted_grade': grade})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
