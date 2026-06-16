import pandas as pd

def load_data(path):
    return pd.read_csv(path)

def clean_data(df):
    # Fill numeric missing with column mean, drop duplicate rows
    for col in ['Math','Science','English','Attendance']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            df[col] = df[col].fillna(df[col].mean())
    df.drop_duplicates(inplace=True)
    return df
