def add_features(df):
    df['Total'] = df[['Math','Science','English']].sum(axis=1)
    df['Average'] = df['Total'] / 3
    # Assign grade
    def grade(x):
        if x >= 90:
            return 'A'
        if x >= 80:
            return 'B'
        if x >= 70:
            return 'C'
        if x >= 60:
            return 'D'
        return 'F'
    df['Grade'] = df['Average'].apply(grade)
    df['Pass'] = df['Average'] >= 40
    return df
