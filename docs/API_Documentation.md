# API Documentation

Base: `http://localhost:5000/api`

GET `/students` - returns list of students with features
GET `/analytics` - returns subject averages, attendance stats, grade distribution
GET `/top-performers?n=5` - top N performers
GET `/grades` - list of students with grade and average
POST `/prediction` - JSON body with Math,Science,English,Attendance -> returns predicted_grade
