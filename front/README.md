# Mindbut Client
A React Native front-end client for [**Mindbut**](https://github.com/MindBut/model) project.

## File Structure
```
.
└── Mindbut/
    ├── screens/
    │   ├── CheckIn.jsx
    │   ├── MoodTracking.jsx
    │   ├── OnBoarding.jsx
    │   ├── Survey.jsx
    │   └── MoodRecord.jsx
    ├── components/
    │   ├── common/
    │   │   └── (공통 컴포넌트)
    │   ├── moodtracking/
    │   │   └── (무드 트래킹 페이지 컴포넌트)
    │   ├── moodrecord/
    │   │   └── (무드 레코드 페이지 컴포넌트)
    │   └── survey/
    │       └── (설문 페이지 컴포넌트)  
    └── assets/
        ├── icons/
        │   └── (감정의 이유 아이콘)
        ├── kakao_login/
        │   └── (카카오 로그인 배너)
        ├── mood/
        │   └── (세부 감정 이미지)
        └── (기타 에셋)
```

## Run
iOS 버전만 구현

```bash
cd Mindbut
cd ios && pod install
npm run ios
```
