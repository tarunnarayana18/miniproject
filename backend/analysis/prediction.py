import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pickle
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parents[1] / 'models' / 'grade_predictor.pkl'

def train_and_save_model(df):
    df = df.copy()
    # Use Math, Science, English, Attendance to predict Grade
    features = df[['Math','Science','English','Attendance']]
    le = LabelEncoder()
    y = le.fit_transform(df['Grade'])
    X_train, X_test, y_train, y_test = train_test_split(features, y, test_size=0.2, random_state=42)
    clf = RandomForestClassifier(n_estimators=50, random_state=42)
    clf.fit(X_train, y_train)
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump({'model': clf, 'le': le}, f)
    score = clf.score(X_test, y_test)
    return score

def load_model():
    if not MODEL_PATH.exists():
        return None
    with open(MODEL_PATH, 'rb') as f:
        obj = pickle.load(f)
    return obj

def predict_grade(sample):
    # sample: dict with Math,Science,English,Attendance
    obj = load_model()
    if obj is None:
        raise RuntimeError('Model not trained')
    model = obj['model']
    le = obj['le']
    X = [[sample['Math'], sample['Science'], sample['English'], sample.get('Attendance', 80)]]
    ypred = model.predict(X)
    return le.inverse_transform(ypred)[0]
