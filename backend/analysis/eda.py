def subject_averages(df):
    return df[['Math','Science','English']].mean().to_dict()

def top_performers(df, n=5):
    return df.sort_values('Average', ascending=False).head(n).to_dict(orient='records')

def grade_distribution(df):
    return df['Grade'].value_counts().to_dict()

def attendance_stats(df):
    return {
        'average_attendance': float(df['Attendance'].mean()),
        'min_attendance': int(df['Attendance'].min()),
        'max_attendance': int(df['Attendance'].max())
    }
