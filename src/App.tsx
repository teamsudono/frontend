import { useState, useRef, useEffect } from 'react'

type Lang = 'en' | 'ko' | 'ja' | 'zh' | 'pt' | 'es'
type Screen = 'splash' | 'login' | 'signup' | 'langSelect' | 'home'
type Tab = 'messages' | 'meetings' | 'trip' | 'profile'
type ChatView = 'list' | 'detail'
type TripView = 'list' | 'detail' | 'new' | 'edit'
type TripStatus = 'upcoming' | 'inProgress' | 'completed'
type ConvoTime = { k: 'min'; n: number } | { k: 'hr'; n: number } | { k: 'yday' } | { k: 'days'; n: number } | { k: 'now' } | { k: 'clock'; s: string }
type MsgTime = ConvoTime

interface UserProfile {
  name: string; company: string; email: string; country: string
  lang: Lang; notifications: boolean; darkMode: boolean; password: string
}

// ─── Translations ─────────────────────────────────────────────────────────────
const T: Record<Lang, Record<string, string>> = {
  en: {
    appName: 'Global Collaboration AI', tagline: 'Break Language & Culture Barriers',
    splashBadge: 'AI-Powered Platform', splashTrusted: 'Trusted by 2,400+ global enterprises',
    featTranslation: 'AI Translation', featCulture: 'Culture Guide', featMeetings: 'Smart Meetings',
    getStarted: 'Get Started →',
    welcomeBack: 'Welcome Back', loginSubtitle: 'Sign in to continue using Global Collaboration AI.',
    emailPlaceholder: 'Enter your email', passwordPlaceholder: 'Enter your password',
    forgotPassword: 'Forgot password?', logIn: 'Log In',
    noAccount: "Don't have an account?", signUp: 'Sign Up', loginSuccess: 'Login Successful',
    loginError: 'Email or password does not match.',
    createAccountTitle: 'Create Account', joinNetwork: 'Join the network',
    signupSubtitle: 'Connect with global business partners worldwide.',
    fullName: 'Full Name', companyName: 'Company Name', email: 'Email',
    password: 'Password', confirmPassword: 'Confirm Password',
    namePlaceholder: 'Enter your full name', companyPlaceholder: 'Enter your company name',
    createPasswordPlaceholder: 'Create a password', confirmPasswordPlaceholder: 'Confirm your password',
    alreadyAccount: 'Already have an account?', signIn: 'Sign In',
    createAccount: 'Create Account', registrationSuccess: 'Registration Successful',
    chooseLanguage: 'Choose Your Preferred Language',
    langSubtitle: "We'll translate the entire app to your preference",
    confirmSelection: 'Confirm Selection', langUpdated: 'Language Updated Successfully',
    langSettings: 'Language Settings',
    messages: 'Messages', meetings: 'Meetings', trip: 'Business Trip', profile: 'Profile',
    search: 'Search conversations...', activeNow: 'Active now',
    typeMessage: 'Type a message...', voiceRecording: '🎤 Voice recording...',
    improveTone: 'Improve Tone', culturalTips: 'Cultural Tips',
    copyToInput: 'Copy to Input', dismiss: 'Dismiss',
    aiImproveToneTitle: 'Improve Business Tone', aiCulturalTitle: 'Cultural Tips',
    translateBtn: 'Translate', originalBtn: 'Original',
    autoTranslated: 'Auto-translated for recipient',
    minAgo: '{n}m ago', hourAgo: '{n}h ago', yesterday: 'Yesterday', daysAgo: '{n}d ago', justNow: 'now',
    meetingAI: 'Meeting AI', uploadPrompt: 'Upload Meeting Transcript',
    uploadSub: 'Drag & drop or tap to browse — TXT files only',
    processing: 'Analyzing meeting transcript...',
    analyzedLabel: 'Analysis Complete · Ready to view summary',
    meetingTimeTitle: 'AI Meeting Time Recommendation',
    meetingTimeSub: 'Find the best meeting time across time zones',
    selectPartnerCountry: 'Select Partner Country',
    selectMyCountry: 'Select My Country',
    analyzingTimezones: 'Analyzing time zones and business working hours...',
    bestMeetingTime: 'Best Recommended Meeting Time',
    recommendedTime: 'Recommended Meeting Time',
    meetingReason: 'Reason',
    meetingReasonOverlap: 'This time falls within normal business hours for both countries.',
    meetingReasonCompromise: 'No full overlap found. This is the best compromise time for both parties.',
    back: 'Back', confirm: 'Confirm',
    businessTripTitle: 'Business Trip', newTrip: '+ New Trip',
    thisYear: 'This Year', countriesLabel: 'Countries', upcomingLabel: 'Upcoming',
    upcoming: 'Upcoming', inProgress: 'In Progress', completed: 'Completed',
    businessGuide: 'Business Guide', cultureSoon: 'Culture guide coming soon for',
    currencyLabel: 'Currency', timezoneLabel: 'Timezone', weatherLabel: 'Weather',
    emergencyLabel: 'Emergency', transportLabel: 'Transportation',
    greetingTitle: 'Greeting Etiquette', dressCodeTitle: 'Business Dress Code',
    meetingEtiquetteTitle: 'Meeting Etiquette', giftTitle: 'Gift Etiquette',
    diningTitle: 'Dining Etiquette', communicationTitle: 'Communication Style',
    negotiationTitle: 'Negotiation Tips', dosDontsTitle: "Business Dos & Don'ts",
    newBusinessTripBtn: '+ New Business Trip',
    selectTripCountry: 'Select Country',
    selectTripDate: 'Select Business Trip Date',
    confirmTripBtn: 'Confirm Trip',
    tripAddedMsg: 'Business Trip Added Successfully',
    editProfile: 'Edit Profile', notifSettings: 'Notification Settings',
    darkMode: 'Dark Mode', helpSupport: 'Help & Support', privacyPolicy: 'Privacy Policy',
    logout: 'Logout', logoutConfirm: 'Are you sure you want to log out?',
    cancel: 'Cancel', proPlan: 'Pro Plan', emailLabel: 'Email', countryLabel: 'Country',
    save: 'Save Changes', profileSaved: 'Profile Updated Successfully', countryField: 'Country',
    selectMeetingStatus: 'Select Meeting Status', meetingStatus: 'Meeting Status',
    scheduled: 'Scheduled', deleteTripBtn: 'Delete Trip',
    deleteConfirmMsg: 'Are you sure you want to delete this trip?',
    delete: 'Delete',
    changeStatus: 'Change Status', saveStatus: 'Save',
    meetingSummaryTitle: 'Meeting Summary', meetingOverview: 'Meeting Overview',
    keyDiscussion: 'Key Discussion Points', importantDecisions: 'Important Decisions',
    actionItems: 'Action Items', followUpInfo: 'Important Follow-up',
    verifyPasswordTitle: 'Password Verification',
    verifyPasswordSub: 'Please enter your password to access profile settings.',
    wrongPassword: 'Incorrect password. Please try again.',
    aiProcessing: 'AI Processing...', typeFirstHint: 'Please type a message first.',
    stepOf: 'Step {n} / 3', viewSummary: 'View Summary', close: 'Close',
  },
  ko: {
    appName: 'Global Collaboration AI', tagline: '언어 및 문화 장벽을 극복하세요',
    splashBadge: 'AI 기반 플랫폼', splashTrusted: '2,400개 이상의 글로벌 기업이 신뢰합니다',
    featTranslation: 'AI 번역', featCulture: '문화 가이드', featMeetings: '스마트 회의',
    getStarted: '시작하기 →',
    welcomeBack: '다시 오신 것을 환영합니다', loginSubtitle: 'Global Collaboration AI를 계속 사용하려면 로그인하세요.',
    emailPlaceholder: '이메일을 입력하세요', passwordPlaceholder: '비밀번호를 입력하세요',
    forgotPassword: '비밀번호를 잊으셨나요?', logIn: '로그인',
    noAccount: '계정이 없으신가요?', signUp: '회원가입', loginSuccess: '로그인 성공',
    loginError: '이메일 또는 비밀번호가 일치하지 않습니다.',
    createAccountTitle: '계정 만들기', joinNetwork: '네트워크에 참여하세요',
    signupSubtitle: '전 세계 비즈니스 파트너와 연결하세요.',
    fullName: '이름', companyName: '회사명', email: '이메일',
    password: '비밀번호', confirmPassword: '비밀번호 확인',
    namePlaceholder: '이름을 입력하세요', companyPlaceholder: '회사명을 입력하세요',
    createPasswordPlaceholder: '비밀번호를 설정하세요', confirmPasswordPlaceholder: '비밀번호를 확인하세요',
    alreadyAccount: '이미 계정이 있으신가요?', signIn: '로그인',
    createAccount: '계정 만들기', registrationSuccess: '회원가입 성공',
    chooseLanguage: '선호 언어를 선택하세요',
    langSubtitle: '선택한 언어로 앱 전체를 번역해 드립니다',
    confirmSelection: '선택 확인', langUpdated: '언어가 성공적으로 업데이트되었습니다',
    langSettings: '언어 설정',
    messages: '메시지', meetings: '회의', trip: '출장', profile: '프로필',
    search: '대화 검색...', activeNow: '지금 활동 중',
    typeMessage: '메시지를 입력하세요...', voiceRecording: '🎤 음성 녹음 중...',
    improveTone: '톤 개선', culturalTips: '문화 팁',
    copyToInput: '입력창에 복사', dismiss: '닫기',
    aiImproveToneTitle: '비즈니스 톤 개선', aiCulturalTitle: '문화 팁',
    translateBtn: '번역', originalBtn: '원문',
    autoTranslated: '수신자에게 자동 번역됨',
    minAgo: '{n}분 전', hourAgo: '{n}시간 전', yesterday: '어제', daysAgo: '{n}일 전', justNow: '방금',
    meetingAI: '회의 AI', uploadPrompt: '회의 텍스트 파일 업로드',
    uploadSub: '드래그 앤 드롭 또는 탭하여 파일 선택 — TXT 파일만 가능',
    processing: '회의 텍스트를 분석하는 중...',
    analyzedLabel: '분석 완료 · 요약 보기 준비됨',
    meetingTimeTitle: 'AI 미팅 시간 추천',
    meetingTimeSub: '시간대 간 최적 미팅 시간을 찾아드립니다',
    selectPartnerCountry: '파트너 국가 선택',
    selectMyCountry: '내 국가 선택',
    analyzingTimezones: '시간대와 업무 시간을 분석하는 중...',
    bestMeetingTime: '최적 권장 미팅 시간',
    recommendedTime: '권장 미팅 시간',
    meetingReason: '이유',
    meetingReasonOverlap: '이 시간대는 두 나라 모두 정상 업무 시간 내에 해당합니다.',
    meetingReasonCompromise: '완전한 겹침 시간이 없습니다. 양측에 가장 적합한 타협 시간입니다.',
    back: '뒤로', confirm: '확인',
    businessTripTitle: '출장', newTrip: '+ 새 출장',
    thisYear: '올해', countriesLabel: '국가', upcomingLabel: '예정',
    upcoming: '예정', inProgress: '진행중', completed: '완료',
    businessGuide: '비즈니스 가이드', cultureSoon: '문화 가이드 준비 중',
    currencyLabel: '통화', timezoneLabel: '시간대', weatherLabel: '날씨',
    emergencyLabel: '긴급', transportLabel: '교통',
    greetingTitle: '인사 예절', dressCodeTitle: '비즈니스 복장 규정',
    meetingEtiquetteTitle: '회의 예절', giftTitle: '선물 예절',
    diningTitle: '식사 예절', communicationTitle: '커뮤니케이션 스타일',
    negotiationTitle: '협상 팁', dosDontsTitle: '비즈니스 에티켓',
    newBusinessTripBtn: '+ 새 출장 추가',
    selectTripCountry: '국가 선택',
    selectTripDate: '출장 날짜 선택',
    confirmTripBtn: '출장 확인',
    tripAddedMsg: '출장이 성공적으로 추가되었습니다',
    editProfile: '프로필 편집', notifSettings: '알림 설정',
    darkMode: '다크 모드', helpSupport: '도움말 및 지원', privacyPolicy: '개인정보처리방침',
    logout: '로그아웃', logoutConfirm: '정말 로그아웃 하시겠습니까?',
    cancel: '취소', proPlan: '프로 플랜', emailLabel: '이메일', countryLabel: '국가',
    save: '변경사항 저장', profileSaved: '프로필이 업데이트되었습니다', countryField: '국가',
    selectMeetingStatus: '미팅 상태 선택', meetingStatus: '미팅 상태',
    scheduled: '예정됨', deleteTripBtn: '출장 삭제',
    deleteConfirmMsg: '이 출장을 삭제하시겠습니까?',
    delete: '삭제',
    changeStatus: '상태 변경', saveStatus: '저장',
    meetingSummaryTitle: '미팅 요약', meetingOverview: '미팅 개요',
    keyDiscussion: '주요 논의 사항', importantDecisions: '중요 결정 사항',
    actionItems: '액션 아이템', followUpInfo: '중요 후속 정보',
    verifyPasswordTitle: '비밀번호 확인',
    verifyPasswordSub: '프로필 설정에 접근하려면 비밀번호를 입력하세요.',
    wrongPassword: '비밀번호가 올바르지 않습니다. 다시 시도해주세요.',
    aiProcessing: 'AI 처리 중...', typeFirstHint: '먼저 메시지를 입력해주세요.',
    stepOf: '단계 {n} / 3', viewSummary: '요약 보기', close: '닫기',
  },
  ja: {
    appName: 'Global Collaboration AI', tagline: '言語と文化の壁を乗り越えよう',
    splashBadge: 'AIパワードプラットフォーム', splashTrusted: '2,400社以上のグローバル企業に信頼されています',
    featTranslation: 'AI翻訳', featCulture: '文化ガイド', featMeetings: 'スマート会議',
    getStarted: '始める →',
    welcomeBack: 'おかえりなさい', loginSubtitle: 'Global Collaboration AIを続けて使用するにはサインインしてください。',
    emailPlaceholder: 'メールアドレスを入力してください', passwordPlaceholder: 'パスワードを入力してください',
    forgotPassword: 'パスワードをお忘れですか？', logIn: 'ログイン',
    noAccount: 'アカウントをお持ちでない方は', signUp: '新規登録', loginSuccess: 'ログイン成功',
    loginError: 'メールアドレスまたはパスワードが一致しません。',
    createAccountTitle: 'アカウント作成', joinNetwork: 'ネットワークに参加する',
    signupSubtitle: '世界中のビジネスパートナーとつながりましょう。',
    fullName: '氏名', companyName: '会社名', email: 'メールアドレス',
    password: 'パスワード', confirmPassword: 'パスワード確認',
    namePlaceholder: '氏名を入力してください', companyPlaceholder: '会社名を入力してください',
    createPasswordPlaceholder: 'パスワードを設定してください', confirmPasswordPlaceholder: 'パスワードを確認してください',
    alreadyAccount: 'すでにアカウントをお持ちの方は', signIn: 'サインイン',
    createAccount: 'アカウント作成', registrationSuccess: '登録完了',
    chooseLanguage: '希望の言語を選択してください',
    langSubtitle: '選択した言語でアプリ全体を翻訳します',
    confirmSelection: '選択を確定', langUpdated: '言語が正常に更新されました',
    langSettings: '言語設定',
    messages: 'メッセージ', meetings: 'ミーティング', trip: '出張', profile: 'プロフィール',
    search: '会話を検索...', activeNow: 'オンライン中',
    typeMessage: 'メッセージを入力...', voiceRecording: '🎤 録音中...',
    improveTone: 'トーン改善', culturalTips: '文化ヒント',
    copyToInput: '入力欄にコピー', dismiss: '閉じる',
    aiImproveToneTitle: 'ビジネストーン改善', aiCulturalTitle: '文化ヒント',
    translateBtn: '翻訳', originalBtn: '原文',
    autoTranslated: '受信者向けに自動翻訳済み',
    minAgo: '{n}分前', hourAgo: '{n}時間前', yesterday: '昨日', daysAgo: '{n}日前', justNow: 'たった今',
    meetingAI: 'ミーティングAI', uploadPrompt: '会議テキストファイルをアップロード',
    uploadSub: 'ドラッグ＆ドロップまたはタップして選択 — TXTファイルのみ',
    processing: '会議テキストを分析中...',
    analyzedLabel: '分析完了 · 要約の表示準備完了',
    meetingTimeTitle: 'AIミーティング時間推奨',
    meetingTimeSub: 'タイムゾーンを超えた最適な会議時間を見つけます',
    selectPartnerCountry: 'パートナー国を選択',
    selectMyCountry: '自国を選択',
    analyzingTimezones: 'タイムゾーンとビジネス時間を分析中...',
    bestMeetingTime: '最適推奨ミーティング時間',
    recommendedTime: '推奨ミーティング時間',
    meetingReason: '理由',
    meetingReasonOverlap: 'この時間帯は両国の通常業務時間内に該当します。',
    meetingReasonCompromise: '完全な重複時間はありません。これが双方に最適な妥協時間です。',
    back: '戻る', confirm: '確認',
    businessTripTitle: '出張', newTrip: '+ 新規出張',
    thisYear: '今年', countriesLabel: '国', upcomingLabel: '予定',
    upcoming: '予定', inProgress: '進行中', completed: '完了',
    businessGuide: 'ビジネスガイド', cultureSoon: '文化ガイド準備中',
    currencyLabel: '通貨', timezoneLabel: 'タイムゾーン', weatherLabel: '天気',
    emergencyLabel: '緊急', transportLabel: '交通',
    greetingTitle: '挨拶のマナー', dressCodeTitle: 'ビジネスドレスコード',
    meetingEtiquetteTitle: '会議のマナー', giftTitle: '贈り物のマナー',
    diningTitle: '食事のマナー', communicationTitle: 'コミュニケーションスタイル',
    negotiationTitle: '交渉のヒント', dosDontsTitle: 'ビジネスマナー',
    newBusinessTripBtn: '+ 新規出張を追加',
    selectTripCountry: '国を選択',
    selectTripDate: '出張日程を選択',
    confirmTripBtn: '出張を確定',
    tripAddedMsg: '出張が正常に追加されました',
    editProfile: 'プロフィール編集', notifSettings: '通知設定',
    darkMode: 'ダークモード', helpSupport: 'ヘルプ＆サポート', privacyPolicy: 'プライバシーポリシー',
    logout: 'ログアウト', logoutConfirm: 'ログアウトしますか？',
    cancel: 'キャンセル', proPlan: 'プロプラン', emailLabel: 'メールアドレス', countryLabel: '国',
    save: '変更を保存', profileSaved: 'プロフィールが更新されました', countryField: '国',
    selectMeetingStatus: '会議ステータスを選択', meetingStatus: '会議ステータス',
    scheduled: '予定', deleteTripBtn: '出張を削除',
    deleteConfirmMsg: 'この出張を削除しますか？',
    delete: '削除',
    changeStatus: 'ステータス変更', saveStatus: '保存',
    meetingSummaryTitle: '会議サマリー', meetingOverview: '会議概要',
    keyDiscussion: '主要な議題', importantDecisions: '重要な決定事項',
    actionItems: 'アクションアイテム', followUpInfo: '重要なフォローアップ',
    verifyPasswordTitle: 'パスワード確認',
    verifyPasswordSub: 'プロフィール設定にアクセスするにはパスワードを入力してください。',
    wrongPassword: 'パスワードが正しくありません。もう一度お試しください。',
    aiProcessing: 'AI処理中...', typeFirstHint: 'まずメッセージを入力してください。',
    stepOf: 'ステップ {n} / 3', viewSummary: '要約を見る', close: '閉じる',
  },
  zh: {
    appName: 'Global Collaboration AI', tagline: '打破语言与文化壁垒',
    splashBadge: 'AI驱动平台', splashTrusted: '受到全球2,400多家企业信赖',
    featTranslation: 'AI翻译', featCulture: '文化指南', featMeetings: '智能会议',
    getStarted: '开始使用 →',
    welcomeBack: '欢迎回来', loginSubtitle: '登录以继续使用 Global Collaboration AI。',
    emailPlaceholder: '请输入邮箱', passwordPlaceholder: '请输入密码',
    forgotPassword: '忘记密码？', logIn: '登录',
    noAccount: '没有账户？', signUp: '注册', loginSuccess: '登录成功',
    loginError: '邮箱或密码不匹配。',
    createAccountTitle: '创建账户', joinNetwork: '加入网络',
    signupSubtitle: '与全球商业伙伴建立联系。',
    fullName: '姓名', companyName: '公司名称', email: '邮箱',
    password: '密码', confirmPassword: '确认密码',
    namePlaceholder: '请输入您的姓名', companyPlaceholder: '请输入公司名称',
    createPasswordPlaceholder: '创建密码', confirmPasswordPlaceholder: '确认密码',
    alreadyAccount: '已有账户？', signIn: '登录',
    createAccount: '创建账户', registrationSuccess: '注册成功',
    chooseLanguage: '选择您的首选语言',
    langSubtitle: '我们将把整个应用翻译成您选择的语言',
    confirmSelection: '确认选择', langUpdated: '语言更新成功',
    langSettings: '语言设置',
    messages: '消息', meetings: '会议', trip: '商务出行', profile: '个人资料',
    search: '搜索对话...', activeNow: '当前在线',
    typeMessage: '输入消息...', voiceRecording: '🎤 录音中...',
    improveTone: '优化语气', culturalTips: '文化提示',
    copyToInput: '复制到输入框', dismiss: '关闭',
    aiImproveToneTitle: '改善商务语气', aiCulturalTitle: '文化提示',
    translateBtn: '翻译', originalBtn: '原文',
    autoTranslated: '已自动翻译给接收者',
    minAgo: '{n}分钟前', hourAgo: '{n}小时前', yesterday: '昨天', daysAgo: '{n}天前', justNow: '刚刚',
    meetingAI: '会议AI', uploadPrompt: '上传会议文字记录',
    uploadSub: '拖放或点击浏览 — 仅支持TXT文件',
    processing: '正在分析会议文字记录...',
    analyzedLabel: '分析完成 · 准备查看摘要',
    meetingTimeTitle: 'AI会议时间推荐',
    meetingTimeSub: '跨时区寻找最佳会议时间',
    selectPartnerCountry: '选择合作伙伴国家',
    selectMyCountry: '选择我的国家',
    analyzingTimezones: '正在分析时区和业务工作时间...',
    bestMeetingTime: '最佳推荐会议时间',
    recommendedTime: '推荐会议时间',
    meetingReason: '原因',
    meetingReasonOverlap: '此时间段在两国正常业务时间范围内。',
    meetingReasonCompromise: '未找到完全重叠时间。这是双方的最佳折中时间。',
    back: '返回', confirm: '确认',
    businessTripTitle: '商务出行', newTrip: '+ 新出行',
    thisYear: '今年', countriesLabel: '国家', upcomingLabel: '即将到来',
    upcoming: '即将到来', inProgress: '进行中', completed: '已完成',
    businessGuide: '商务指南', cultureSoon: '文化指南即将上线',
    currencyLabel: '货币', timezoneLabel: '时区', weatherLabel: '天气',
    emergencyLabel: '紧急', transportLabel: '交通',
    greetingTitle: '问候礼仪', dressCodeTitle: '商务着装规范',
    meetingEtiquetteTitle: '会议礼仪', giftTitle: '礼品礼仪',
    diningTitle: '餐饮礼仪', communicationTitle: '沟通风格',
    negotiationTitle: '谈判技巧', dosDontsTitle: '商务注意事项',
    newBusinessTripBtn: '+ 新增商务出行',
    selectTripCountry: '选择国家',
    selectTripDate: '选择出行日期',
    confirmTripBtn: '确认行程',
    tripAddedMsg: '商务出行添加成功',
    editProfile: '编辑资料', notifSettings: '通知设置',
    darkMode: '深色模式', helpSupport: '帮助与支持', privacyPolicy: '隐私政策',
    logout: '退出登录', logoutConfirm: '确定要退出登录吗？',
    cancel: '取消', proPlan: '专业版', emailLabel: '邮箱', countryLabel: '国家',
    save: '保存更改', profileSaved: '资料更新成功', countryField: '国家',
    selectMeetingStatus: '选择会议状态', meetingStatus: '会议状态',
    scheduled: '已计划', deleteTripBtn: '删除行程',
    deleteConfirmMsg: '您确定要删除此行程吗？',
    delete: '删除',
    changeStatus: '更改状态', saveStatus: '保存',
    meetingSummaryTitle: '会议摘要', meetingOverview: '会议概述',
    keyDiscussion: '主要讨论要点', importantDecisions: '重要决定',
    actionItems: '行动项目', followUpInfo: '重要跟进信息',
    verifyPasswordTitle: '密码验证',
    verifyPasswordSub: '请输入您的密码以访问个人资料设置。',
    wrongPassword: '密码不正确，请重试。',
    aiProcessing: 'AI处理中...', typeFirstHint: '请先输入一条消息。',
    stepOf: '步骤 {n} / 3', viewSummary: '查看摘要', close: '关闭',
  },
  pt: {
    appName: 'Global Collaboration AI', tagline: 'Quebre Barreiras de Idioma e Cultura',
    splashBadge: 'Plataforma com IA', splashTrusted: 'Confiado por 2.400+ empresas globais',
    featTranslation: 'Tradução com IA', featCulture: 'Guia Cultural', featMeetings: 'Reuniões Inteligentes',
    getStarted: 'Começar →',
    welcomeBack: 'Bem-vindo de Volta', loginSubtitle: 'Entre para continuar usando o Global Collaboration AI.',
    emailPlaceholder: 'Digite seu e-mail', passwordPlaceholder: 'Digite sua senha',
    forgotPassword: 'Esqueceu a senha?', logIn: 'Entrar',
    noAccount: 'Não tem uma conta?', signUp: 'Cadastrar', loginSuccess: 'Login Realizado com Sucesso',
    loginError: 'E-mail ou senha não correspondem.',
    createAccountTitle: 'Criar Conta', joinNetwork: 'Junte-se à rede',
    signupSubtitle: 'Conecte-se com parceiros de negócios globais.',
    fullName: 'Nome Completo', companyName: 'Nome da Empresa', email: 'E-mail',
    password: 'Senha', confirmPassword: 'Confirmar Senha',
    namePlaceholder: 'Digite seu nome completo', companyPlaceholder: 'Digite o nome da empresa',
    createPasswordPlaceholder: 'Crie uma senha', confirmPasswordPlaceholder: 'Confirme sua senha',
    alreadyAccount: 'Já tem uma conta?', signIn: 'Entrar',
    createAccount: 'Criar Conta', registrationSuccess: 'Cadastro Realizado com Sucesso',
    chooseLanguage: 'Escolha Seu Idioma Preferido',
    langSubtitle: 'Traduziremos todo o aplicativo para o seu idioma',
    confirmSelection: 'Confirmar Seleção', langUpdated: 'Idioma Atualizado com Sucesso',
    langSettings: 'Configurações de Idioma',
    messages: 'Mensagens', meetings: 'Reuniões', trip: 'Viagem de Negócios', profile: 'Perfil',
    search: 'Pesquisar conversas...', activeNow: 'Ativo agora',
    typeMessage: 'Digite uma mensagem...', voiceRecording: '🎤 Gravando voz...',
    improveTone: 'Melhorar Tom', culturalTips: 'Dicas Culturais',
    copyToInput: 'Copiar para Input', dismiss: 'Fechar',
    aiImproveToneTitle: 'Melhorar Tom Profissional', aiCulturalTitle: 'Dicas Culturais',
    translateBtn: 'Traduzir', originalBtn: 'Original',
    autoTranslated: 'Traduzido automaticamente para o destinatário',
    minAgo: 'há {n}min', hourAgo: 'há {n}h', yesterday: 'ontem', daysAgo: 'há {n}d', justNow: 'agora',
    meetingAI: 'Reunião AI', uploadPrompt: 'Enviar Transcrição da Reunião',
    uploadSub: 'Arraste ou toque para selecionar — somente arquivos TXT',
    processing: 'Analisando transcrição da reunião...',
    analyzedLabel: 'Análise Concluída · Pronto para ver o resumo',
    meetingTimeTitle: 'Recomendação de Horário de Reunião IA',
    meetingTimeSub: 'Encontre o melhor horário entre fusos horários',
    selectPartnerCountry: 'Selecionar País Parceiro',
    selectMyCountry: 'Selecionar Meu País',
    analyzingTimezones: 'Analisando fusos horários e horário comercial...',
    bestMeetingTime: 'Melhor Horário de Reunião Recomendado',
    recommendedTime: 'Horário de Reunião Recomendado',
    meetingReason: 'Motivo',
    meetingReasonOverlap: 'Este horário está dentro do expediente normal de ambos os países.',
    meetingReasonCompromise: 'Nenhuma sobreposição completa encontrada. Este é o melhor horário de compromisso para ambas as partes.',
    back: 'Voltar', confirm: 'Confirmar',
    businessTripTitle: 'Viagem de Negócios', newTrip: '+ Nova Viagem',
    thisYear: 'Este Ano', countriesLabel: 'Países', upcomingLabel: 'Programada',
    upcoming: 'Programada', inProgress: 'Em Andamento', completed: 'Concluída',
    businessGuide: 'Guia de Negócios', cultureSoon: 'Guia cultural em breve para',
    currencyLabel: 'Moeda', timezoneLabel: 'Fuso Horário', weatherLabel: 'Clima',
    emergencyLabel: 'Emergência', transportLabel: 'Transporte',
    greetingTitle: 'Etiqueta de Cumprimentos', dressCodeTitle: 'Código de Vestimenta',
    meetingEtiquetteTitle: 'Etiqueta em Reuniões', giftTitle: 'Etiqueta de Presentes',
    diningTitle: 'Etiqueta à Mesa', communicationTitle: 'Estilo de Comunicação',
    negotiationTitle: 'Dicas de Negociação', dosDontsTitle: 'O que Fazer e Não Fazer',
    newBusinessTripBtn: '+ Nova Viagem de Negócios',
    selectTripCountry: 'Selecionar País',
    selectTripDate: 'Selecionar Data da Viagem',
    confirmTripBtn: 'Confirmar Viagem',
    tripAddedMsg: 'Viagem de Negócios Adicionada com Sucesso',
    editProfile: 'Editar Perfil', notifSettings: 'Configurações de Notificação',
    darkMode: 'Modo Escuro', helpSupport: 'Ajuda e Suporte', privacyPolicy: 'Política de Privacidade',
    logout: 'Sair', logoutConfirm: 'Tem certeza que deseja sair?',
    cancel: 'Cancelar', proPlan: 'Plano Pro', emailLabel: 'E-mail', countryLabel: 'País',
    save: 'Salvar Alterações', profileSaved: 'Perfil Atualizado com Sucesso', countryField: 'País',
    selectMeetingStatus: 'Selecionar Status da Reunião', meetingStatus: 'Status da Reunião',
    scheduled: 'Agendada', deleteTripBtn: 'Excluir Viagem',
    deleteConfirmMsg: 'Tem certeza que deseja excluir esta viagem?',
    delete: 'Excluir',
    changeStatus: 'Alterar Status', saveStatus: 'Salvar',
    meetingSummaryTitle: 'Resumo da Reunião', meetingOverview: 'Visão Geral da Reunião',
    keyDiscussion: 'Pontos-Chave da Discussão', importantDecisions: 'Decisões Importantes',
    actionItems: 'Itens de Ação', followUpInfo: 'Informações de Acompanhamento',
    verifyPasswordTitle: 'Verificação de Senha',
    verifyPasswordSub: 'Por favor, insira sua senha para acessar as configurações do perfil.',
    wrongPassword: 'Senha incorreta. Por favor, tente novamente.',
    aiProcessing: 'Processando IA...', typeFirstHint: 'Por favor, digite uma mensagem primeiro.',
    stepOf: 'Etapa {n} / 3', viewSummary: 'Ver Resumo', close: 'Fechar',
  },
  es: {
    appName: 'Global Collaboration AI', tagline: 'Rompe Barreras de Idioma y Cultura',
    splashBadge: 'Plataforma con IA', splashTrusted: 'Confiado por más de 2.400 empresas globales',
    featTranslation: 'Traducción con IA', featCulture: 'Guía Cultural', featMeetings: 'Reuniones Inteligentes',
    getStarted: 'Comenzar →',
    welcomeBack: 'Bienvenido de Nuevo', loginSubtitle: 'Inicia sesión para continuar usando Global Collaboration AI.',
    emailPlaceholder: 'Ingresa tu correo electrónico', passwordPlaceholder: 'Ingresa tu contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?', logIn: 'Iniciar Sesión',
    noAccount: '¿No tienes una cuenta?', signUp: 'Registrarse', loginSuccess: 'Inicio de Sesión Exitoso',
    loginError: 'El correo o la contraseña no coinciden.',
    createAccountTitle: 'Crear Cuenta', joinNetwork: 'Únete a la red',
    signupSubtitle: 'Conéctate con socios comerciales globales.',
    fullName: 'Nombre Completo', companyName: 'Nombre de la Empresa', email: 'Correo Electrónico',
    password: 'Contraseña', confirmPassword: 'Confirmar Contraseña',
    namePlaceholder: 'Ingresa tu nombre completo', companyPlaceholder: 'Ingresa el nombre de la empresa',
    createPasswordPlaceholder: 'Crea una contraseña', confirmPasswordPlaceholder: 'Confirma tu contraseña',
    alreadyAccount: '¿Ya tienes una cuenta?', signIn: 'Iniciar Sesión',
    createAccount: 'Crear Cuenta', registrationSuccess: 'Registro Exitoso',
    chooseLanguage: 'Elige Tu Idioma Preferido',
    langSubtitle: 'Traduciremos toda la aplicación a tu idioma',
    confirmSelection: 'Confirmar Selección', langUpdated: 'Idioma Actualizado Exitosamente',
    langSettings: 'Configuración de Idioma',
    messages: 'Mensajes', meetings: 'Reuniones', trip: 'Viaje de Negocios', profile: 'Perfil',
    search: 'Buscar conversaciones...', activeNow: 'Activo ahora',
    typeMessage: 'Escribe un mensaje...', voiceRecording: '🎤 Grabando voz...',
    improveTone: 'Mejorar Tono', culturalTips: 'Consejos Culturales',
    copyToInput: 'Copiar al Input', dismiss: 'Cerrar',
    aiImproveToneTitle: 'Mejorar Tono Profesional', aiCulturalTitle: 'Consejos Culturales',
    translateBtn: 'Traducir', originalBtn: 'Original',
    autoTranslated: 'Traducido automáticamente para el destinatario',
    minAgo: 'hace {n}min', hourAgo: 'hace {n}h', yesterday: 'ayer', daysAgo: 'hace {n}d', justNow: 'ahora',
    meetingAI: 'Reunión IA', uploadPrompt: 'Subir Transcripción de la Reunión',
    uploadSub: 'Arrastra o toca para explorar — solo archivos TXT',
    processing: 'Analizando transcripción de la reunión...',
    analyzedLabel: 'Análisis Completado · Listo para ver el resumen',
    meetingTimeTitle: 'Recomendación de Hora de Reunión IA',
    meetingTimeSub: 'Encuentra el mejor horario entre zonas horarias',
    selectPartnerCountry: 'Seleccionar País Socio',
    selectMyCountry: 'Seleccionar Mi País',
    analyzingTimezones: 'Analizando zonas horarias y horario laboral...',
    bestMeetingTime: 'Mejor Hora de Reunión Recomendada',
    recommendedTime: 'Hora de Reunión Recomendada',
    meetingReason: 'Razón',
    meetingReasonOverlap: 'Este horario se encuentra dentro del horario laboral normal de ambos países.',
    meetingReasonCompromise: 'No se encontró superposición completa. Este es el mejor horario de compromiso para ambas partes.',
    back: 'Volver', confirm: 'Confirmar',
    businessTripTitle: 'Viaje de Negocios', newTrip: '+ Nuevo Viaje',
    thisYear: 'Este Año', countriesLabel: 'Países', upcomingLabel: 'Próximo',
    upcoming: 'Próximo', inProgress: 'En Progreso', completed: 'Completado',
    businessGuide: 'Guía de Negocios', cultureSoon: 'Guía cultural próximamente para',
    currencyLabel: 'Moneda', timezoneLabel: 'Zona Horaria', weatherLabel: 'Clima',
    emergencyLabel: 'Emergencia', transportLabel: 'Transporte',
    greetingTitle: 'Etiqueta de Saludos', dressCodeTitle: 'Código de Vestimenta',
    meetingEtiquetteTitle: 'Etiqueta en Reuniones', giftTitle: 'Etiqueta de Regalos',
    diningTitle: 'Etiqueta en la Mesa', communicationTitle: 'Estilo de Comunicación',
    negotiationTitle: 'Consejos de Negociación', dosDontsTitle: 'Qué Hacer y No Hacer',
    newBusinessTripBtn: '+ Nuevo Viaje de Negocios',
    selectTripCountry: 'Seleccionar País',
    selectTripDate: 'Seleccionar Fecha del Viaje',
    confirmTripBtn: 'Confirmar Viaje',
    tripAddedMsg: 'Viaje de Negocios Agregado Exitosamente',
    editProfile: 'Editar Perfil', notifSettings: 'Configuración de Notificaciones',
    darkMode: 'Modo Oscuro', helpSupport: 'Ayuda y Soporte', privacyPolicy: 'Política de Privacidad',
    logout: 'Cerrar Sesión', logoutConfirm: '¿Estás seguro de que quieres cerrar sesión?',
    cancel: 'Cancelar', proPlan: 'Plan Pro', emailLabel: 'Correo Electrónico', countryLabel: 'País',
    save: 'Guardar Cambios', profileSaved: 'Perfil Actualizado Exitosamente', countryField: 'País',
    selectMeetingStatus: 'Seleccionar Estado de la Reunión', meetingStatus: 'Estado de la Reunión',
    scheduled: 'Programada', deleteTripBtn: 'Eliminar Viaje',
    deleteConfirmMsg: '¿Estás seguro de que deseas eliminar este viaje?',
    delete: 'Eliminar',
    changeStatus: 'Cambiar Estado', saveStatus: 'Guardar',
    meetingSummaryTitle: 'Resumen de la Reunión', meetingOverview: 'Descripción General',
    keyDiscussion: 'Puntos Clave de Discusión', importantDecisions: 'Decisiones Importantes',
    actionItems: 'Elementos de Acción', followUpInfo: 'Información de Seguimiento',
    verifyPasswordTitle: 'Verificación de Contraseña',
    verifyPasswordSub: 'Por favor, ingresa tu contraseña para acceder a la configuración del perfil.',
    wrongPassword: 'Contraseña incorrecta. Por favor, inténtalo de nuevo.',
    aiProcessing: 'Procesando IA...', typeFirstHint: 'Por favor, escribe un mensaje primero.',
    stepOf: 'Paso {n} / 3', viewSummary: 'Ver Resumen', close: 'Cerrar',
  },
}

const i18n = (lang: Lang, key: string) => T[lang]?.[key] ?? T.en[key] ?? key

function fmtTime(ts: ConvoTime | MsgTime, lang: Lang): string {
  const r = (key: string, n?: number) => {
    const s = i18n(lang, key)
    return n !== undefined ? s.replace('{n}', String(n)) : s
  }
  switch (ts.k) {
    case 'min':   return r('minAgo', ts.n)
    case 'hr':    return r('hourAgo', ts.n)
    case 'yday':  return r('yesterday')
    case 'days':  return r('daysAgo', ts.n)
    case 'now':   return r('justNow')
    case 'clock': return ts.s
  }
}

const LANGUAGES = [
  { code: 'ko' as Lang, name: 'Korean', flag: '🇰🇷', native: '한국어' },
  { code: 'en' as Lang, name: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'ja' as Lang, name: 'Japanese', flag: '🇯🇵', native: '日本語' },
  { code: 'zh' as Lang, name: 'Chinese', flag: '🇨🇳', native: '中文' },
  { code: 'pt' as Lang, name: 'Portuguese (Brazil)', flag: '🇧🇷', native: 'Português' },
  { code: 'es' as Lang, name: 'Spanish', flag: '🇪🇸', native: 'Español' },
]

const COUNTRY_LANG: Record<string, Lang> = {
  Japan: 'ja', USA: 'en', China: 'zh', Brazil: 'pt', Spain: 'es', Korea: 'ko',
}
const partnerLang = (country: string): Lang => COUNTRY_LANG[country] ?? 'en'

// ─── Culture Guide (Localized) ────────────────────────────────────────────────
interface CultureSection { icon: string; titleKey: string; content: string }
interface CultureGuide {
  sections: CultureSection[]
  emergency: string; transport: string; weather: string; currency: string; timezone: string
}

type L6 = Record<Lang, string>

const CL: Record<string, {
  sections: Array<{ icon: string; titleKey: string; content: L6 }>
  emergency: L6; transport: L6; weather: L6
  currency: string; timezone: string
}> = {
  Japan: {
    currency: 'Japanese Yen (¥) · ¥1 ≈ $0.007 USD',
    timezone: 'JST (UTC+9) · No daylight saving time',
    sections: [
      { icon: '🤝', titleKey: 'greetingTitle', content: {
        en: 'Bow when greeting — the deeper the bow, the more respectful. Avoid direct eye contact during bows. Exchange business cards (meishi) with both hands and bow slightly. Study the card before putting it away; never write on it or put it in your pocket immediately.',
        ko: '인사할 때 절을 하세요. 깊이 숙일수록 더 존경스럽습니다. 절하는 동안 직접적인 눈 맞춤을 피하세요. 명함(메이시)은 양손으로 교환하고 살짝 절하세요. 보관 전 명함을 잘 살펴보고, 글을 쓰거나 즉시 주머니에 넣지 마세요.',
        ja: '挨拶では礼をします。礼が深いほど敬意が伝わります。礼の際は直接目を合わせないようにしましょう。名刺は両手で交換し、軽く会釈してください。しまう前に名刺をよく確認し、書き込みや即座のポケット収納はマナー違反です。',
        zh: '问候时鞠躬，越深越显尊重。鞠躬时避免直视对方。名片用双手交换并微微点头。仔细阅读名片后再收起，不可在名片上书写或立即放入口袋。',
        pt: 'Faça reverências ao cumprimentar — quanto mais profunda, mais respeitosa. Evite contato visual durante as reverências. Troque cartões de visita (meishi) com ambas as mãos. Leia o cartão com atenção antes de guardá-lo; nunca escreva nele nem o coloque imediatamente no bolso.',
        es: 'Inclínate al saludar — cuanto más profunda, más respetuosa. Evita el contacto visual durante las reverencias. Intercambia tarjetas de visita (meishi) con ambas manos. Lee detenidamente la tarjeta antes de guardarla; nunca escribas en ella ni la pongas inmediatamente en el bolsillo.',
      }},
      { icon: '👔', titleKey: 'dressCodeTitle', content: {
        en: 'Conservative and formal attire is expected. Men: dark suits, white shirts, conservative ties. Women: formal suits or conservative dresses. Avoid flashy accessories. Shoes should be easy to remove as you may visit tatami-floored rooms.',
        ko: '보수적이고 격식 있는 복장이 요구됩니다. 남성: 다크 수트, 흰 셔츠, 무난한 넥타이. 여성: 정장 또는 단정한 드레스. 화려한 액세서리는 피하세요. 다다미 바닥 공간을 방문할 수 있으므로 벗기 편한 신발을 착용하세요.',
        ja: '保守的でフォーマルな服装が求められます。男性はダークスーツに白シャツと控えめなネクタイ。女性はフォーマルスーツまたは保守的なドレス。派手なアクセサリーは避け、畳の部屋に入る可能性があるため脱ぎやすい靴を着用してください。',
        zh: '着装要保守正式。男性穿深色西装、白衬衫和素色领带。女性穿正式套装或保守连衣裙。避免华丽配饰。鞋子要便于脱着，因为可能需要进入铺有榻榻米的房间。',
        pt: 'Trajes conservadores e formais são esperados. Homens: ternos escuros, camisas brancas, gravatas discretas. Mulheres: ternos formais ou vestidos conservadores. Evite acessórios chamativos e prefira sapatos fáceis de remover, pois pode visitar salas com tatame.',
        es: 'Se espera vestimenta conservadora y formal. Hombres: trajes oscuros, camisas blancas, corbatas discretas. Mujeres: trajes formales o vestidos conservadores. Evita accesorios llamativos y usa zapatos fáciles de quitar, ya que podrías visitar habitaciones con tatami.',
      }},
      { icon: '📋', titleKey: 'meetingEtiquetteTitle', content: {
        en: 'Arrive 5–10 minutes early. The most senior person enters first. Decisions are made by consensus (nemawashi). Silence is a sign of respect, not disagreement. Avoid direct "no" — listen for indirect refusals like "that might be difficult."',
        ko: '5~10분 일찍 도착하세요. 가장 선임자가 먼저 입장합니다. 결정은 합의(네마와시)로 이루어집니다. 침묵은 존경의 표시입니다. 직접적인 "아니오"를 피하고 "그건 조금 어려울 수 있습니다" 같은 간접적 거절에 귀를 기울이세요.',
        ja: '5〜10分前に到着しましょう。上位者から入室します。意思決定は根回しによる合意形成で行われます。沈黙は敬意の表れです。直接的な「いいえ」は避け、「少し難しいかもしれません」などの間接的な断りに注意してください。',
        zh: '提前5至10分钟到达。职位最高者先进场。决策通过协商达成共识（根回し）。沉默是尊重的表示。避免直接说"不"，注意"那可能有些困难"等间接拒绝的表达。',
        pt: 'Chegue 5 a 10 minutos antes. A pessoa mais sênior entra primeiro. As decisões são tomadas por consenso (nemawashi). O silêncio é sinal de respeito. Evite o "não" direto — escute recusas indiretas como "isso pode ser difícil".',
        es: 'Llega 5-10 minutos antes. La persona más senior entra primero. Las decisiones se toman por consenso (nemawashi). El silencio es señal de respeto. Evita el "no" directo — escucha rechazos indirectos como "eso podría ser difícil".',
      }},
      { icon: '🎁', titleKey: 'giftTitle', content: {
        en: 'Bring high-quality gifts from your home country. Present and receive gifts with both hands. Gifts are often not opened immediately. Wrap gifts neatly — presentation matters. Avoid sets of 4 (death) or white flowers (funerals).',
        ko: '고국에서 가져온 고품질 선물을 가져오세요. 양손으로 선물을 주고받으세요. 선물은 즉시 열지 않는 경우가 많습니다. 선물 포장을 깔끔하게 하세요. 4가지 세트(죽음)나 흰 꽃(장례식)은 피하세요.',
        ja: '自国から上質な贈り物を持参しましょう。両手で渡し、受け取ります。すぐには開けないことが多いです。丁寧に包みましょう。4（死）の数字や白い花（葬儀）は避けてください。',
        zh: '携带来自本国的高质量礼物。用双手赠送和接受礼物。礼物通常不会立即拆开。要精心包装，注重外观。避免4件套（谐音"死"）或白色花（丧礼）。',
        pt: 'Traga presentes de alta qualidade do seu país. Ofereça e receba com ambas as mãos. Os presentes frequentemente não são abertos imediatamente. Embale com cuidado — a apresentação importa. Evite conjuntos de 4 (morte) ou flores brancas (funerais).',
        es: 'Trae regalos de alta calidad de tu país. Ofrece y recibe con ambas manos. Los regalos frecuentemente no se abren de inmediato. Envuelve con cuidado — la presentación importa. Evita conjuntos de 4 (muerte) o flores blancas (funerales).',
      }},
      { icon: '🍱', titleKey: 'diningTitle', content: {
        en: 'Wait to be seated. Say "Itadakimasu" before eating and "Gochisousama" after. Never stick chopsticks upright in rice. Pour drinks for others before yourself. Business dinners are for relationship building, not deal closing.',
        ko: '자리 안내를 기다리세요. 식전에 "이타다키마스", 식후에 "고치소사마"라고 말하세요. 밥에 젓가락을 수직으로 세우지 마세요. 자신보다 다른 사람의 음료를 먼저 채우세요. 비즈니스 저녁은 관계 구축을 위한 것입니다.',
        ja: '席への案内を待ちましょう。食前に「いただきます」、食後に「ごちそうさま」と言います。ご飯に箸を立てないようにしましょう。飲み物は自分より先に他の人に注ぎましょう。ビジネスディナーは関係構築のためです。',
        zh: '等待就座。饭前说"いただきます"，饭后说"ごちそうさま"。不要把筷子竖插在米饭里。先为他人倒饮料再给自己。商务晚宴是为了建立关系，不是签约谈判。',
        pt: 'Aguarde ser acomodado. Diga "Itadakimasu" antes e "Gochisousama" depois. Nunca coloque os pauzinhos verticalmente no arroz. Sirva bebidas para os outros primeiro. Jantares de negócios são para construir relacionamentos.',
        es: 'Espera a ser sentado. Di "Itadakimasu" antes y "Gochisousama" después. Nunca coloques los palillos verticalmente en el arroz. Sirve bebidas a los demás primero. Las cenas de negocios son para construir relaciones.',
      }},
      { icon: '💬', titleKey: 'communicationTitle', content: {
        en: 'Indirect and high-context communication. "Yes" may mean "I understand," not "I agree." Save face for everyone — never criticize publicly. Use polite honorifics. Written communication is often preferred for important matters.',
        ko: '간접적이고 고맥락적인 소통. "예"는 "이해했습니다"를 의미할 수 있으며 "동의합니다"가 아닐 수 있습니다. 모두의 체면을 살리세요. 공손한 경칭을 사용하세요. 중요한 사항에는 서면 소통이 선호됩니다.',
        ja: '間接的でハイコンテキストなコミュニケーション。「はい」は「理解しました」を意味し、「同意します」ではない場合があります。全員の面目を保ちましょう。丁寧な敬語を使用し、重要な事項には文書を好みます。',
        zh: '间接、高语境的沟通方式。"是"可能意味着"我理解"，而非"我同意"。维护所有人的面子，绝不当众批评。使用礼貌的尊称，重要事项优先以书面形式沟通。',
        pt: 'Comunicação indireta e de alto contexto. "Sim" pode significar "Entendo", não "Concordo". Preserve o rosto de todos — nunca critique publicamente. Use honoríficos educados. A comunicação escrita é preferida para assuntos importantes.',
        es: 'Comunicación indirecta y de alto contexto. "Sí" puede significar "Entiendo", no "Estoy de acuerdo". Salva la imagen de todos — nunca critiques públicamente. Usa honoríficos corteses. La comunicación escrita se prefiere para asuntos importantes.',
      }},
      { icon: '🏆', titleKey: 'negotiationTitle', content: {
        en: 'Negotiations are slow and consensus-driven. Patience is critical. Build trust over time before asking for commitments. Use intermediaries when possible. Price negotiations should be subtle, never aggressive.',
        ko: '협상은 느리고 합의 중심으로 진행됩니다. 인내심이 중요합니다. 약속을 요구하기 전에 신뢰를 쌓으세요. 가능하면 중개인을 활용하세요. 가격 협상은 미묘하게, 절대 공격적으로 하지 마세요.',
        ja: '交渉はゆっくりと合意形成を重視して進みます。忍耐が重要です。約束を求める前に信頼を築きましょう。仲介者を活用しましょう。価格交渉は控えめに行い、絶対に攻撃的にならないでください。',
        zh: '谈判缓慢，以共识为导向。耐心至关重要。在要求承诺之前先建立信任。尽可能借助中间人。价格谈判要细腻，绝不能咄咄逼人。',
        pt: 'As negociações são lentas e orientadas ao consenso. A paciência é fundamental. Construa confiança antes de pedir compromissos. Use intermediários sempre que possível. As negociações de preço devem ser sutis, nunca agressivas.',
        es: 'Las negociaciones son lentas y orientadas al consenso. La paciencia es fundamental. Construye confianza antes de pedir compromisos. Usa intermediarios cuando sea posible. Las negociaciones de precios deben ser sutiles, nunca agresivas.',
      }},
      { icon: '✅', titleKey: 'dosDontsTitle', content: {
        en: "DO: Be punctual. Show respect for hierarchy. Prepare thoroughly. DON'T: Be overly casual. Disagree loudly. Skip the business card ritual. Discuss personal topics early in relationships.",
        ko: '해야 할 것: 시간을 엄수하세요. 위계질서를 존중하세요. 철저히 준비하세요. 하지 말아야 할 것: 지나치게 가볍게 대하지 마세요. 공개적으로 반대하지 마세요. 명함 교환 의식을 생략하지 마세요. 초기에 개인적인 주제를 꺼내지 마세요.',
        ja: 'すること: 時間を守る。階層を尊重する。徹底的に準備する。してはいけないこと: 過度にカジュアルにならない。大声で反論しない。名刺交換の儀式を省略しない。関係初期に個人的な話題を出さない。',
        zh: '应该：守时。尊重层级。做充分准备。不应该：过于随意。大声争论。跳过名片交换仪式。在初期关系中讨论私人话题。',
        pt: 'FAÇA: Seja pontual. Respeite a hierarquia. Prepare-se minuciosamente. NÃO FAÇA: Seja excessivamente informal. Discorde em voz alta. Pule o ritual de troca de cartões. Discuta tópicos pessoais no início dos relacionamentos.',
        es: 'HAGA: Sea puntual. Respete la jerarquía. Prepárese minuciosamente. NO HAGA: Sea excesivamente informal. Esté en desacuerdo en voz alta. Omita el ritual de intercambio de tarjetas. Discuta temas personales al inicio de las relaciones.',
      }},
    ],
    emergency: { en: '110 (Police) · 119 (Fire/Ambulance)', ko: '110 (경찰) · 119 (소방/구급)', ja: '110（警察）· 119（消防/救急）', zh: '110（警察）· 119（消防/急救）', pt: '110 (Polícia) · 119 (Bombeiros/Ambulância)', es: '110 (Policía) · 119 (Bomberos/Ambulancia)' },
    transport: { en: 'JR Pass for bullet trains, Suica/Pasmo cards for metro. Taxis are reliable but expensive.', ko: 'JR 패스로 신칸센 이용, 수이카/파스모 카드로 지하철 이용. 택시는 믿을 수 있지만 비쌉니다.', ja: 'JRパスで新幹線、スイカ/パスモカードで地下鉄を利用。タクシーは信頼できますが高額です。', zh: '乘坐新干线可使用JR Pass，地铁使用Suica/Pasmo卡。出租车可靠但价格较贵。', pt: 'JR Pass para shinkansen, cartões Suica/Pasmo para o metrô. Os táxis são confiáveis, mas caros.', es: 'JR Pass para el shinkansen, tarjetas Suica/Pasmo para el metro. Los taxis son confiables pero caros.' },
    weather: { en: 'August: Hot and humid (~32°C). Typhoon season. Pack light breathable clothing.', ko: '8월: 덥고 습함 (~32°C). 태풍 시즌. 가볍고 통기성 좋은 옷을 챙기세요.', ja: '8月：暑く湿度が高い（約32℃）。台風シーズン。軽くて通気性の良い衣類を持参してください。', zh: '8月：炎热潮湿（约32°C）。台风季节。请携带轻薄透气的衣物。', pt: 'Agosto: Quente e úmido (~32°C). Temporada de tufões. Leve roupas leves e respiráveis.', es: 'Agosto: Caluroso y húmedo (~32°C). Temporada de tifones. Lleva ropa ligera y transpirable.' },
  },
  USA: {
    currency: 'US Dollar ($) — widely accepted globally',
    timezone: 'Multiple: EST (UTC-5), CST (UTC-6), PST (UTC-8)',
    sections: [
      { icon: '🤝', titleKey: 'greetingTitle', content: {
        en: 'Firm handshake with direct eye contact. First names are used quickly. Casual "How are you?" is rhetorical. Business cards are exchanged casually.',
        ko: '굳은 악수와 직접적인 눈 맞춤. 이름을 빠르게 사용합니다. "잘 지내세요?"는 수사적 질문입니다. 명함 교환은 비공식적으로 이루어집니다.',
        ja: '力強い握手と直接的なアイコンタクト。すぐにファーストネームで呼び合います。「お元気ですか？」は挨拶文句です。名刺交換は気軽に行われます。',
        zh: '坚定握手并保持直接目光接触。很快互称名字。"你好吗？"是礼貌性问候。名片交换较为随意。',
        pt: 'Aperto de mão firme com contato visual direto. Primeiro nome usado rapidamente. "Como vai?" é retórico. Cartões de visita são trocados de forma informal.',
        es: 'Apretón de manos firme con contacto visual directo. El nombre de pila se usa rápidamente. "¿Cómo está?" es retórico. Las tarjetas de visita se intercambian de manera informal.',
      }},
      { icon: '👔', titleKey: 'dressCodeTitle', content: {
        en: 'Varies by industry. Tech: business casual. Finance/Law: formal suits. "Smart casual" is generally safe.',
        ko: '업계마다 다릅니다. 기술: 비즈니스 캐주얼. 금융/법률: 정장. "스마트 캐주얼"이 일반적으로 안전합니다.',
        ja: '業界によって異なります。テック系：ビジネスカジュアル。金融/法律：フォーマルスーツ。「スマートカジュアル」が一般的に無難です。',
        zh: '因行业而异。科技业：商务休闲。金融/法律：正式西装。"智能休闲"通常比较安全。',
        pt: 'Varia por setor. Tecnologia: business casual. Finanças/Direito: ternos formais. "Smart casual" é geralmente seguro.',
        es: 'Varía según la industria. Tecnología: business casual. Finanzas/Derecho: trajes formales. "Smart casual" es generalmente seguro.',
      }},
      { icon: '📋', titleKey: 'meetingEtiquetteTitle', content: {
        en: 'Time is money — get to the point quickly. Agendas are followed strictly. Decisions can be made on the spot. Direct questions and answers are expected.',
        ko: '시간은 돈입니다 — 빠르게 핵심으로 들어가세요. 일정표가 엄격히 준수됩니다. 즉석에서 결정을 내릴 수 있습니다. 직접적인 질문과 답변이 기대됩니다.',
        ja: '時間はお金です。すぐに要点に入りましょう。アジェンダは厳守されます。その場で決断が下されることもあります。直接的な質疑応答が期待されます。',
        zh: '时间就是金钱——迅速切入主题。严格遵守议程。可以当场做出决定。期待直接的问答。',
        pt: 'Tempo é dinheiro — vá direto ao ponto. As pautas são seguidas rigorosamente. Decisões podem ser tomadas na hora. Perguntas e respostas diretas são esperadas.',
        es: 'El tiempo es dinero — ve directo al grano. Los programas se siguen estrictamente. Las decisiones pueden tomarse en el momento. Se esperan preguntas y respuestas directas.',
      }},
      { icon: '🎁', titleKey: 'giftTitle', content: {
        en: 'Gifts are not common in business settings. If giving, choose branded promotional items.',
        ko: '비즈니스 환경에서 선물은 흔하지 않습니다. 줄 경우 브랜드 홍보 아이템을 선택하세요.',
        ja: 'ビジネスの場での贈り物は一般的ではありません。贈る場合は、ブランドのプロモーションアイテムを選びましょう。',
        zh: '商务场合不常送礼。如果要送，可以选择带品牌标识的促销品。',
        pt: 'Presentes não são comuns em ambientes de negócios. Se for presentear, escolha itens promocionais da marca.',
        es: 'Los regalos no son comunes en entornos empresariales. Si vas a regalar, elige artículos promocionales de marca.',
      }},
      { icon: '🍔', titleKey: 'diningTitle', content: {
        en: 'Business lunches are common and brief. Dutch treat is normal. Dietary preferences are widely respected.',
        ko: '비즈니스 점심은 흔하고 간단합니다. 각자 부담이 일반적입니다. 식이 선호도가 널리 존중됩니다.',
        ja: 'ビジネスランチは一般的で手短です。割り勘が普通です。食事の好みは広く尊重されます。',
        zh: '商务午餐很常见且简短。各自付账是常态。饮食偏好受到广泛尊重。',
        pt: 'Almoços de negócios são comuns e breves. Divisão de conta é normal. Preferências alimentares são amplamente respeitadas.',
        es: 'Los almuerzos de negocios son comunes y breves. Pagar a escote es normal. Las preferencias dietéticas son ampliamente respetadas.',
      }},
      { icon: '💬', titleKey: 'communicationTitle', content: {
        en: 'Direct and low-context. Say what you mean. Small talk about sports or weather opens conversations.',
        ko: '직접적이고 저맥락적입니다. 의미하는 바를 직접 말하세요. 스포츠나 날씨에 대한 잡담으로 대화를 시작합니다.',
        ja: '直接的でローコンテキストなコミュニケーション。思っていることを直接言いましょう。スポーツや天気についての雑談で会話を始めます。',
        zh: '直接、低语境的沟通方式。有什么说什么。关于体育或天气的闲聊可以打开话题。',
        pt: 'Direto e de baixo contexto. Diga o que pensa. Conversa leve sobre esportes ou clima abre as conversas.',
        es: 'Directo y de bajo contexto. Di lo que quieres decir. La charla sobre deportes o el clima abre las conversaciones.',
      }},
      { icon: '🏆', titleKey: 'negotiationTitle', content: {
        en: 'Be direct about pricing and terms. Contracts are binding and taken seriously. Deadlines are real commitments.',
        ko: '가격과 조건에 대해 직접적으로 말하세요. 계약은 구속력이 있으며 진지하게 받아들여집니다. 마감일은 실제 약속입니다.',
        ja: '価格や条件については直接話しましょう。契約は拘束力があり、真剣に扱われます。締め切りは本当のコミットメントです。',
        zh: '直接讨论定价和条款。合同具有约束力且受到认真对待。截止日期是真正的承诺。',
        pt: 'Seja direto sobre preços e termos. Os contratos são vinculativos e levados a sério. Os prazos são compromissos reais.',
        es: 'Sé directo sobre precios y términos. Los contratos son vinculantes y se toman en serio. Los plazos son compromisos reales.',
      }},
      { icon: '✅', titleKey: 'dosDontsTitle', content: {
        en: "DO: Be direct and concise. Follow up promptly. Respect time. DON'T: Be overly formal. Take delays lightly.",
        ko: '해야 할 것: 직접적이고 간결하게 말하세요. 신속하게 후속 조치를 취하세요. 시간을 존중하세요. 하지 말아야 할 것: 지나치게 격식을 차리지 마세요. 지연을 가볍게 여기지 마세요.',
        ja: 'すること: 直接的で簡潔に。迅速にフォローアップする。時間を尊重する。してはいけないこと: 過度に形式的にならない。遅延を軽く見ない。',
        zh: '应该：直接简洁。及时跟进。尊重时间。不应该：过于正式。轻视延误。',
        pt: 'FAÇA: Seja direto e conciso. Faça o acompanhamento rapidamente. Respeite o tempo. NÃO FAÇA: Seja excessivamente formal. Tome os atrasos levianamente.',
        es: 'HAGA: Sea directo y conciso. Haga seguimiento rápidamente. Respete el tiempo. NO HAGA: Sea excesivamente formal. Tome los retrasos a la ligera.',
      }},
    ],
    emergency: { en: '911 (Police/Fire/Ambulance)', ko: '911 (경찰/소방/구급)', ja: '911（警察/消防/救急）', zh: '911（警察/消防/救护）', pt: '911 (Polícia/Bombeiros/Ambulância)', es: '911 (Policía/Bomberos/Ambulancia)' },
    transport: { en: 'Uber/Lyft widely available. Renting a car recommended outside major cities.', ko: '우버/리프트가 널리 이용 가능합니다. 대도시 외곽에서는 렌터카를 권장합니다.', ja: 'Uber/Lyftが広く利用可能。主要都市以外ではレンタカーを推奨します。', zh: 'Uber/Lyft广泛可用。在主要城市以外建议租车。', pt: 'Uber/Lyft amplamente disponíveis. Aluguel de carro recomendado fora das grandes cidades.', es: 'Uber/Lyft ampliamente disponibles. Se recomienda alquilar un coche fuera de las grandes ciudades.' },
    weather: { en: 'August: Varies by region. SF: 18°C. NYC: 30°C (humid). LA: 28°C (dry).', ko: '8월: 지역마다 다릅니다. SF: 18°C. NYC: 30°C (습함). LA: 28°C (건조).', ja: '8月：地域によって異なります。SF：18℃。NYC：30℃（湿度高め）。LA：28℃（乾燥）。', zh: '8月：因地区而异。旧金山：18°C。纽约：30°C（潮湿）。洛杉矶：28°C（干燥）。', pt: 'Agosto: Varia por região. SF: 18°C. NYC: 30°C (úmido). LA: 28°C (seco).', es: 'Agosto: Varía por región. SF: 18°C. NYC: 30°C (húmedo). LA: 28°C (seco).' },
  },
  Germany: {
    currency: 'Euro (€) · €1 ≈ $1.09 USD',
    timezone: 'CET (UTC+1), CEST (UTC+2) in summer',
    sections: [
      { icon: '🤝', titleKey: 'greetingTitle', content: {
        en: 'Firm handshake. Use formal titles (Herr/Frau + surname) until invited to use first names. Punctuality is non-negotiable.',
        ko: '굳은 악수. 이름을 사용하도록 초대받을 때까지 공식 호칭(Herr/Frau + 성)을 사용하세요. 시간 엄수는 필수입니다.',
        ja: '力強い握手。ファーストネームを使うよう招待されるまで、正式な敬称（Herr/Frau + 姓）を使いましょう。時間厳守は絶対です。',
        zh: '坚定握手。在被邀请使用名字之前，使用正式称谓（Herr/Frau + 姓）。守时是必须的。',
        pt: 'Aperto de mão firme. Use títulos formais (Herr/Frau + sobrenome) até ser convidado a usar o primeiro nome. Pontualidade é inegociável.',
        es: 'Apretón de manos firme. Usa títulos formales (Herr/Frau + apellido) hasta que te inviten a usar el nombre de pila. La puntualidad es innegociable.',
      }},
      { icon: '👔', titleKey: 'dressCodeTitle', content: {
        en: 'Conservative and formal. Dark suits for men. Quality matters more than fashion.',
        ko: '보수적이고 격식 있습니다. 남성은 다크 수트. 패션보다 품질이 더 중요합니다.',
        ja: '保守的でフォーマル。男性はダークスーツ。ファッションより品質が重視されます。',
        zh: '保守正式。男性穿深色西装。品质比时尚更重要。',
        pt: 'Conservador e formal. Ternos escuros para homens. A qualidade importa mais do que a moda.',
        es: 'Conservador y formal. Trajes oscuros para hombres. La calidad importa más que la moda.',
      }},
      { icon: '📋', titleKey: 'meetingEtiquetteTitle', content: {
        en: 'Meetings are highly structured. Small talk is minimal. Data and facts are valued over opinions.',
        ko: '회의는 매우 체계적입니다. 잡담은 최소화됩니다. 의견보다 데이터와 사실이 중시됩니다.',
        ja: '会議は高度に構造化されています。雑談は最小限です。意見よりデータと事実が重視されます。',
        zh: '会议高度结构化。闲聊极少。数据和事实比意见更受重视。',
        pt: 'As reuniões são altamente estruturadas. A conversa informal é mínima. Dados e fatos são valorizados acima de opiniões.',
        es: 'Las reuniones están altamente estructuradas. La charla informal es mínima. Los datos y los hechos se valoran más que las opiniones.',
      }},
      { icon: '🎁', titleKey: 'giftTitle', content: {
        en: 'Gifts are rare in business. Wine or fine chocolates are acceptable.',
        ko: '비즈니스에서 선물은 드뭅니다. 와인이나 고급 초콜릿은 적합합니다.',
        ja: 'ビジネスでの贈り物は稀です。ワインや上質なチョコレートが適しています。',
        zh: '商务场合送礼少见。葡萄酒或高档巧克力是合适的选择。',
        pt: 'Presentes são raros nos negócios. Vinho ou chocolates finos são aceitáveis.',
        es: 'Los regalos son raros en los negocios. El vino o los chocolates finos son aceptables.',
      }},
      { icon: '🍺', titleKey: 'diningTitle', content: {
        en: 'Business dinners are formal. Eye contact during toasts is essential.',
        ko: '비즈니스 저녁은 격식 있습니다. 건배 시 눈 맞춤은 필수입니다.',
        ja: 'ビジネスディナーはフォーマルです。乾杯の際のアイコンタクトは必須です。',
        zh: '商务晚宴正式。敬酒时保持眼神接触至关重要。',
        pt: 'Os jantares de negócios são formais. O contato visual durante os brindes é essencial.',
        es: 'Las cenas de negocios son formales. El contacto visual durante los brindis es esencial.',
      }},
      { icon: '💬', titleKey: 'communicationTitle', content: {
        en: 'Very direct and factual. Criticism is professional, not personal.',
        ko: '매우 직접적이고 사실에 근거합니다. 비판은 전문적인 것이지 개인적인 것이 아닙니다.',
        ja: '非常に直接的で事実に基づいています。批判は専門的なものであり、個人的なものではありません。',
        zh: '非常直接，基于事实。批评是职业性的，而非针对个人。',
        pt: 'Muito direto e factual. A crítica é profissional, não pessoal.',
        es: 'Muy directo y factual. La crítica es profesional, no personal.',
      }},
      { icon: '🏆', titleKey: 'negotiationTitle', content: {
        en: 'Come with detailed data. Germans respect expertise. Rushed decisions are viewed with suspicion.',
        ko: '상세한 데이터를 준비해 오세요. 독일인들은 전문 지식을 존중합니다. 급하게 내린 결정은 의심스럽게 봅니다.',
        ja: '詳細なデータを持参しましょう。ドイツ人は専門知識を尊重します。急いで下された決断は疑念を持たれます。',
        zh: '携带详细数据。德国人尊重专业知识。仓促做出的决定会引起怀疑。',
        pt: 'Venha com dados detalhados. Os alemães respeitam a especialização. Decisões precipitadas são vistas com suspeita.',
        es: 'Ven con datos detallados. Los alemanes respetan la especialización. Las decisiones apresuradas se ven con sospecha.',
      }},
      { icon: '✅', titleKey: 'dosDontsTitle', content: {
        en: "DO: Be precise. Honor commitments. DON'T: Use first names without permission. Be late.",
        ko: '해야 할 것: 정확하게 행동하세요. 약속을 지키세요. 하지 말아야 할 것: 허락 없이 이름을 사용하지 마세요. 늦지 마세요.',
        ja: 'すること: 正確に行動する。約束を守る。してはいけないこと: 許可なくファーストネームを使わない。遅刻しない。',
        zh: '应该：精确行事。遵守承诺。不应该：未经许可使用名字。迟到。',
        pt: 'FAÇA: Seja preciso. Honre compromissos. NÃO FAÇA: Use o primeiro nome sem permissão. Se atrase.',
        es: 'HAGA: Sea preciso. Honre los compromisos. NO HAGA: Use el nombre de pila sin permiso. Llegue tarde.',
      }},
    ],
    emergency: { en: '110 (Police) · 112 (Fire/Ambulance)', ko: '110 (경찰) · 112 (소방/구급)', ja: '110（警察）· 112（消防/救急）', zh: '110（警察）· 112（消防/急救）', pt: '110 (Polícia) · 112 (Bombeiros/Ambulância)', es: '110 (Policía) · 112 (Bomberos/Ambulancia)' },
    transport: { en: 'Excellent rail network (DB). U-Bahn and S-Bahn in cities.', ko: '우수한 철도 네트워크(DB). 도시에서 U반과 S반 이용.', ja: '優れた鉄道網（DB）。都市ではUバーンとSバーンを利用。', zh: '出色的铁路网络（DB）。城市内有U-Bahn和S-Bahn。', pt: 'Excelente rede ferroviária (DB). U-Bahn e S-Bahn nas cidades.', es: 'Excelente red ferroviaria (DB). U-Bahn y S-Bahn en las ciudades.' },
    weather: { en: 'July–August: Warm (~24°C). Occasional rain.', ko: '7~8월: 따뜻함 (~24°C). 간헐적인 비.', ja: '7〜8月：暖かい（約24℃）。時折雨が降ります。', zh: '7-8月：温暖（约24°C）。偶有降雨。', pt: 'Julho–Agosto: Quente (~24°C). Chuva ocasional.', es: 'Julio–Agosto: Cálido (~24°C). Lluvia ocasional.' },
  },
  China: {
    currency: 'Chinese Yuan (¥/CNY) · Alipay/WeChat Pay dominate.',
    timezone: 'CST (UTC+8)',
    sections: [
      { icon: '🤝', titleKey: 'greetingTitle', content: {
        en: 'Gentle handshake. Business cards with both hands. Take a moment to read the card before placing it on the table.',
        ko: '부드러운 악수. 양손으로 명함을 교환하세요. 명함을 테이블에 놓기 전에 잠시 살펴보세요.',
        ja: '穏やかな握手。名刺は両手で。テーブルに置く前に名刺をよく見てください。',
        zh: '轻柔握手。双手交换名片。在放到桌上之前，先花时间仔细阅读名片。',
        pt: 'Aperto de mão suave. Cartões de visita com ambas as mãos. Reserve um momento para ler o cartão antes de colocá-lo na mesa.',
        es: 'Apretón de manos suave. Tarjetas de visita con ambas manos. Tómate un momento para leer la tarjeta antes de colocarla en la mesa.',
      }},
      { icon: '👔', titleKey: 'dressCodeTitle', content: {
        en: 'Conservative and professional. Dark suits preferred. Quality brands signal respect.',
        ko: '보수적이고 전문적입니다. 다크 수트가 선호됩니다. 품질 브랜드는 존경을 나타냅니다.',
        ja: '保守的でプロフェッショナル。ダークスーツが好まれます。高品質ブランドは敬意を示します。',
        zh: '保守专业。首选深色西装。高品质品牌能体现尊重。',
        pt: 'Conservador e profissional. Ternos escuros preferidos. Marcas de qualidade sinalizam respeito.',
        es: 'Conservador y profesional. Se prefieren trajes oscuros. Las marcas de calidad señalan respeto.',
      }},
      { icon: '📋', titleKey: 'meetingEtiquetteTitle', content: {
        en: 'Senior executives enter first. Building "guanxi" is essential before business.',
        ko: '고위 임원이 먼저 입장합니다. 비즈니스 전에 "관시" 구축이 필수입니다.',
        ja: '上位者から入室します。ビジネスの前に「グァンシー（関係）」を築くことが不可欠です。',
        zh: '高管先进场。在做生意之前建立"关系"至关重要。',
        pt: 'Os executivos seniores entram primeiro. Construir "guanxi" é essencial antes dos negócios.',
        es: 'Los ejecutivos sénior entran primero. Construir "guanxi" es esencial antes de los negocios.',
      }},
      { icon: '🎁', titleKey: 'giftTitle', content: {
        en: 'Gifts are important. Avoid clocks or sets of 4. Red packaging is auspicious.',
        ko: '선물은 중요합니다. 시계나 4가지 세트를 피하세요. 빨간 포장이 길조입니다.',
        ja: '贈り物は重要です。時計や4の数字を避けましょう。赤い包装が縁起良いとされます。',
        zh: '送礼很重要。避免送钟或4件套。红色包装是吉祥的。',
        pt: 'Presentes são importantes. Evite relógios ou conjuntos de 4. Embalagem vermelha é auspiciosa.',
        es: 'Los regalos son importantes. Evita relojes o conjuntos de 4. El embalaje rojo es auspicioso.',
      }},
      { icon: '🥢', titleKey: 'diningTitle', content: {
        en: 'Banquets are important for relationship building. Always toast with "Ganbei!"',
        ko: '연회는 관계 구축에 중요합니다. 항상 "건배!"로 건배하세요.',
        ja: '宴会は関係構築のために重要です。乾杯は必ず「乾杯！」で。',
        zh: '宴请对于建立关系非常重要。敬酒时总说"干杯！"',
        pt: 'Os banquetes são importantes para a construção de relacionamentos. Sempre brinde com "Ganbei!"',
        es: 'Los banquetes son importantes para construir relaciones. Siempre brinda con "¡Ganbei!"',
      }},
      { icon: '💬', titleKey: 'communicationTitle', content: {
        en: 'Indirect and face-saving. "Maybe" often means no.',
        ko: '간접적이고 체면을 중시합니다. "아마도"는 종종 "아니오"를 의미합니다.',
        ja: '間接的で面子を重んじます。「たぶん」は「いいえ」を意味することが多いです。',
        zh: '间接，注重面子。"也许"通常意味着拒绝。',
        pt: 'Indireto e protetor da imagem. "Talvez" frequentemente significa não.',
        es: 'Indirecto y protector de la imagen. "Quizás" a menudo significa no.',
      }},
      { icon: '🏆', titleKey: 'negotiationTitle', content: {
        en: 'Patience is essential — negotiations can be lengthy. Build trust over multiple meetings.',
        ko: '인내심이 필수입니다 — 협상이 길어질 수 있습니다. 여러 차례 미팅을 통해 신뢰를 쌓으세요.',
        ja: '忍耐が不可欠です。交渉は長引く可能性があります。複数回の会議を通じて信頼を築きましょう。',
        zh: '耐心至关重要——谈判可能旷日持久。通过多次会面建立信任。',
        pt: 'A paciência é essencial — as negociações podem ser longas. Construa confiança ao longo de várias reuniões.',
        es: 'La paciencia es esencial — las negociaciones pueden ser largas. Construye confianza a lo largo de varias reuniones.',
      }},
      { icon: '✅', titleKey: 'dosDontsTitle', content: {
        en: "DO: Show respect for hierarchy. Be patient. DON'T: Discuss Taiwan, Tibet, or politics.",
        ko: '해야 할 것: 위계에 대한 존중을 표하세요. 인내심을 가지세요. 하지 말아야 할 것: 대만, 티베트, 정치에 대해 논의하지 마세요.',
        ja: 'すること: 階層への敬意を示す。辛抱強くある。してはいけないこと: 台湾、チベット、政治について議論しない。',
        zh: '应该：表示对层级的尊重。保持耐心。不应该：讨论台湾、西藏或政治话题。',
        pt: 'FAÇA: Mostre respeito pela hierarquia. Seja paciente. NÃO FAÇA: Discuta Taiwan, Tibet ou política.',
        es: 'HAGA: Muestre respeto por la jerarquía. Sea paciente. NO HAGA: Discuta Taiwán, Tíbet o política.',
      }},
    ],
    emergency: { en: '110 (Police) · 120 (Ambulance) · 119 (Fire)', ko: '110 (경찰) · 120 (구급) · 119 (소방)', ja: '110（警察）· 120（救急）· 119（消防）', zh: '110（警察）· 120（急救）· 119（消防）', pt: '110 (Polícia) · 120 (Ambulância) · 119 (Bombeiros)', es: '110 (Policía) · 120 (Ambulancia) · 119 (Bomberos)' },
    transport: { en: 'High-speed rail (HSR) excellent between cities. DiDi in cities.', ko: '도시 간 고속철도(HSR) 우수. 도시에서 디디(DiDi) 이용.', ja: '都市間の高速鉄道（HSR）が優秀。都市内ではDiDiを利用。', zh: '城市间高铁极为便利。城市内使用滴滴出行。', pt: 'Trem de alta velocidade (TAV) excelente entre cidades. DiDi nas cidades.', es: 'El tren de alta velocidad (TAV) es excelente entre ciudades. DiDi en las ciudades.' },
    weather: { en: 'August: Hot and humid (~32–35°C). Typhoon possible in coastal areas.', ko: '8월: 덥고 습함 (~32–35°C). 해안 지역에서 태풍 가능성.', ja: '8月：暑く湿度が高い（約32〜35℃）。沿岸地域では台風の可能性があります。', zh: '8月：炎热潮湿（约32-35°C）。沿海地区可能有台风。', pt: 'Agosto: Quente e úmido (~32–35°C). Tufão possível em áreas costeiras.', es: 'Agosto: Caluroso y húmedo (~32–35°C). Posible tifón en áreas costeras.' },
  },
  Brazil: {
    currency: 'Brazilian Real (R$) · Pix (instant payment) very popular.',
    timezone: 'BRT (UTC-3)',
    sections: [
      { icon: '🤝', titleKey: 'greetingTitle', content: {
        en: 'Warm handshake or hug. First names used quickly. Small talk is essential before business.',
        ko: '따뜻한 악수 또는 포옹. 이름을 빠르게 사용합니다. 비즈니스 전 잡담이 필수입니다.',
        ja: '温かい握手やハグ。すぐにファーストネームを使います。ビジネス前の世間話が不可欠です。',
        zh: '热情握手或拥抱。很快使用名字。开展业务前闲聊必不可少。',
        pt: 'Aperto de mão caloroso ou abraço. Primeiro nome usado rapidamente. A conversa informal é essencial antes dos negócios.',
        es: 'Apretón de manos cálido o abrazo. El nombre de pila se usa rápidamente. La charla es esencial antes de los negocios.',
      }},
      { icon: '👔', titleKey: 'dressCodeTitle', content: {
        en: 'Business formal in São Paulo and Rio. Quality suits expected.',
        ko: '상파울루와 리우에서는 비즈니스 정장. 고품질 수트가 기대됩니다.',
        ja: 'サンパウロとリオではビジネスフォーマル。上質なスーツが期待されます。',
        zh: '在圣保罗和里约热内卢需穿商务正装。注重西装品质。',
        pt: 'Formal de negócios em São Paulo e Rio. Ternos de qualidade são esperados.',
        es: 'Formal de negocios en São Paulo y Río. Se esperan trajes de calidad.',
      }},
      { icon: '📋', titleKey: 'meetingEtiquetteTitle', content: {
        en: 'Meetings start late — 15-30 minutes delay is normal. Agendas are flexible.',
        ko: '회의는 늦게 시작합니다 — 15~30분 지연이 정상입니다. 일정표는 유연합니다.',
        ja: '会議は遅れて始まります。15〜30分の遅れが普通です。アジェンダは柔軟です。',
        zh: '会议开始较晚——延迟15-30分钟是正常的。议程较为灵活。',
        pt: 'As reuniões começam tarde — atraso de 15-30 minutos é normal. As pautas são flexíveis.',
        es: 'Las reuniones empiezan tarde — un retraso de 15-30 minutos es normal. Los programas son flexibles.',
      }},
      { icon: '🎁', titleKey: 'giftTitle', content: {
        en: 'Gifts are welcome. Avoid purple or black wrapping (mourning colors).',
        ko: '선물은 환영받습니다. 보라색이나 검은색 포장(애도 색상)을 피하세요.',
        ja: '贈り物は喜ばれます。紫や黒の包装（喪の色）は避けましょう。',
        zh: '礼物受欢迎。避免使用紫色或黑色包装（哀悼的颜色）。',
        pt: 'Presentes são bem-vindos. Evite embalagem roxa ou preta (cores de luto).',
        es: 'Los regalos son bienvenidos. Evita el embalaje morado o negro (colores de luto).',
      }},
      { icon: '🥩', titleKey: 'diningTitle', content: {
        en: 'Churrasco (BBQ) dinners are popular for business. Long, social meals are the norm.',
        ko: '슈하스코(BBQ) 저녁은 비즈니스에서 인기입니다. 길고 사교적인 식사가 일반적입니다.',
        ja: 'シュラスコ（BBQ）ディナーはビジネスで人気です。長くて社交的な食事が普通です。',
        zh: '烤肉（Churrasco）晚宴在商务场合很受欢迎。漫长的社交餐是常态。',
        pt: 'Os jantares de churrasco são populares para negócios. Refeições longas e sociais são a norma.',
        es: 'Las cenas de churrasco (BBQ) son populares para negocios. Las comidas largas y sociales son la norma.',
      }},
      { icon: '💬', titleKey: 'communicationTitle', content: {
        en: 'Warm, expressive, and relationship-focused. Personal topics are welcome ice-breakers.',
        ko: '따뜻하고 표현적이며 관계 중심적입니다. 개인적인 주제는 환영받는 아이스브레이커입니다.',
        ja: '温かく表現豊かで、関係重視のコミュニケーション。個人的な話題は歓迎されるアイスブレイカーです。',
        zh: '热情、有表达力，以关系为中心。个人话题是受欢迎的破冰方式。',
        pt: 'Caloroso, expressivo e focado no relacionamento. Tópicos pessoais são bem-vindos como quebra-gelo.',
        es: 'Cálido, expresivo y centrado en las relaciones. Los temas personales son bienvenidos como rompehielos.',
      }},
      { icon: '🏆', titleKey: 'negotiationTitle', content: {
        en: 'Relationship-first culture — build trust before pushing deals. Timelines are flexible.',
        ko: '관계 우선 문화 — 거래를 추진하기 전에 신뢰를 쌓으세요. 일정은 유연합니다.',
        ja: '関係優先の文化。取引を進める前に信頼を築きましょう。スケジュールは柔軟です。',
        zh: '关系优先的文化——在推进交易之前建立信任。时间安排较为灵活。',
        pt: 'Cultura de relacionamento primeiro — construa confiança antes de fechar negócios. Os prazos são flexíveis.',
        es: 'Cultura de relaciones primero — construye confianza antes de cerrar tratos. Los plazos son flexibles.',
      }},
      { icon: '✅', titleKey: 'dosDontsTitle', content: {
        en: "DO: Build personal rapport. Be warm and sociable. DON'T: Rush to business. Show impatience.",
        ko: '해야 할 것: 개인적인 친밀감을 형성하세요. 따뜻하고 사교적으로 행동하세요. 하지 말아야 할 것: 서둘러 비즈니스로 넘어가지 마세요. 조급함을 보이지 마세요.',
        ja: 'すること: 個人的な親密さを築く。温かく社交的に振る舞う。してはいけないこと: すぐにビジネスに急がない。焦りを見せない。',
        zh: '应该：建立个人情谊。热情友好。不应该：急于谈业务。表现出不耐烦。',
        pt: 'FAÇA: Construa rapport pessoal. Seja caloroso e sociável. NÃO FAÇA: Apresse-se para os negócios. Mostre impaciência.',
        es: 'HAGA: Construya rapport personal. Sea cálido y sociable. NO HAGA: Se apresure a los negocios. Muestre impaciencia.',
      }},
    ],
    emergency: { en: '190 (Police) · 192 (Ambulance) · 193 (Fire)', ko: '190 (경찰) · 192 (구급) · 193 (소방)', ja: '190（警察）· 192（救急）· 193（消防）', zh: '190（警察）· 192（急救）· 193（消防）', pt: '190 (Polícia) · 192 (Ambulância) · 193 (Bombeiros)', es: '190 (Policía) · 192 (Ambulancia) · 193 (Bomberos)' },
    transport: { en: '99 and Uber widely available. Metro in São Paulo and Rio.', ko: '99와 우버가 널리 이용 가능. 상파울루와 리우에 지하철.', ja: '99とUberが広く利用可能。サンパウロとリオに地下鉄があります。', zh: '99和Uber广泛可用。圣保罗和里约有地铁。', pt: '99 e Uber amplamente disponíveis. Metrô em São Paulo e Rio.', es: '99 y Uber ampliamente disponibles. Metro en São Paulo y Río.' },
    weather: { en: 'August: São Paulo — mild (~20°C, dry season). Rio — warm (~25°C).', ko: '8월: 상파울루 — 온화함 (~20°C, 건기). 리우 — 따뜻함 (~25°C).', ja: '8月：サンパウロ — 温和（約20℃、乾季）。リオ — 温暖（約25℃）。', zh: '8月：圣保罗——温和（约20°C，旱季）。里约——温暖（约25°C）。', pt: 'Agosto: São Paulo — ameno (~20°C, estação seca). Rio — quente (~25°C).', es: 'Agosto: São Paulo — suave (~20°C, temporada seca). Río — cálido (~25°C).' },
  },
}

function getGuide(country: string, lang: Lang): CultureGuide | null {
  const raw = CL[country]
  if (!raw) return null
  return {
    sections: raw.sections.map(s => ({ icon: s.icon, titleKey: s.titleKey, content: s.content[lang] ?? s.content.en })),
    emergency: raw.emergency[lang] ?? raw.emergency.en,
    transport: raw.transport[lang] ?? raw.transport.en,
    weather: raw.weather[lang] ?? raw.weather.en,
    currency: raw.currency,
    timezone: raw.timezone,
  }
}

// ─── Meeting Time Feature ─────────────────────────────────────────────────────
interface MeetingCountry { name: string; flag: string; offset: number; abbr: string }

const MEETING_COUNTRIES: MeetingCountry[] = [
  { name: 'Japan', flag: '🇯🇵', offset: 9, abbr: 'JST' },
  { name: 'Korea', flag: '🇰🇷', offset: 9, abbr: 'KST' },
  { name: 'China', flag: '🇨🇳', offset: 8, abbr: 'CST' },
  { name: 'Singapore', flag: '🇸🇬', offset: 8, abbr: 'SGT' },
  { name: 'USA (EST)', flag: '🇺🇸', offset: -5, abbr: 'EST' },
  { name: 'USA (PST)', flag: '🇺🇸', offset: -8, abbr: 'PST' },
  { name: 'UK', flag: '🇬🇧', offset: 0, abbr: 'GMT' },
  { name: 'Germany', flag: '🇩🇪', offset: 1, abbr: 'CET' },
  { name: 'Spain', flag: '🇪🇸', offset: 1, abbr: 'CET' },
  { name: 'Brazil', flag: '🇧🇷', offset: -3, abbr: 'BRT' },
  { name: 'India', flag: '🇮🇳', offset: 5.5, abbr: 'IST' },
  { name: 'Australia', flag: '🇦🇺', offset: 10, abbr: 'AEST' },
]

function findBestMeetingTime(c1: MeetingCountry, c2: MeetingCountry) {
  for (let utcH = 0; utcH < 24; utcH++) {
    const h1 = (utcH + c1.offset + 24) % 24
    const h2 = (utcH + c2.offset + 24) % 24
    if (h1 >= 9 && h1 <= 16 && h2 >= 9 && h2 <= 16) {
      return { h1, h2, overlap: true }
    }
  }
  let best = { utcH: 0, score: Infinity }
  for (let utcH = 0; utcH < 24; utcH++) {
    const h1 = (utcH + c1.offset + 24) % 24
    const h2 = (utcH + c2.offset + 24) % 24
    if (h1 >= 7 && h1 <= 21 && h2 >= 7 && h2 <= 21) {
      const score = Math.abs(h1 - 13) + Math.abs(h2 - 13)
      if (score < best.score) best = { utcH, score }
    }
  }
  const h1 = (best.utcH + c1.offset + 24) % 24
  const h2 = (best.utcH + c2.offset + 24) % 24
  return { h1, h2, overlap: false }
}

function fmtHour(h: number): string {
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:00 ${ampm}`
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
interface Message {
  id: number; text: string; from: 'me' | 'them'
  time: MsgTime; read: boolean
  translations?: Partial<Record<Lang, string>>
}

interface Convo {
  id: number; name: string; country: string; flag: string; avatar: string
  color: string; lastMessage: string; time: ConvoTime; messages: Message[]
}

const countUnread = (c: Convo) => c.messages.filter(m => m.from === 'them' && !m.read).length

const CONVOS_INIT: Convo[] = [
  {
    id: 1, name: 'Yamamoto Corp', country: 'Japan', flag: '🇯🇵', avatar: 'YC', color: '#EEF2FF',
    lastMessage: 'パートナーシップを推進することに大変興味を持っております。',
    time: { k: 'min', n: 2 },
    messages: [
      { id: 1, text: 'おはようございます。パートナーシップのご提案を詳細に検討いたしました。', from: 'them', read: true, time: { k: 'clock', s: '09:00' }, translations: { en: 'Good morning. We have thoroughly reviewed your partnership proposal.', ko: '안녕하세요. 파트너십 제안서를 면밀히 검토하였습니다.', zh: '早上好。我们已仔细审阅了您的合作提案。', pt: 'Bom dia. Analisamos minuciosamente sua proposta de parceria.', es: 'Buenos días. Hemos revisado minuciosamente su propuesta de asociación.' } },
      { id: 2, text: 'Thank you for taking the time. We are very excited about this opportunity.', from: 'me', read: true, time: { k: 'clock', s: '09:12' }, translations: { ko: '시간을 내주셔서 감사합니다. 이 기회에 매우 설레고 있습니다.', ja: 'お時間をいただきありがとうございます。この機会にとても期待しています。', zh: '感谢您的时间。我们对这个机会感到非常兴奋。', pt: 'Obrigado pelo seu tempo. Estamos muito empolgados com esta oportunidade.', es: 'Gracias por su tiempo. Estamos muy emocionados con esta oportunidad.' } },
      { id: 3, text: '来週火曜日に弊社の経営陣との通話を設定できますでしょうか？', from: 'them', read: true, time: { k: 'clock', s: '09:45' }, translations: { en: 'Could we arrange a call with our executive team next Tuesday?', ko: '다음 주 화요일에 저희 경영진과 통화를 잡을 수 있을까요?', zh: '我们能否安排下周二与我们高管团队通话？', pt: 'Podemos agendar uma ligação com nossa equipe executiva na próxima terça-feira?', es: '¿Podríamos organizar una llamada con nuestro equipo ejecutivo el próximo martes?' } },
      { id: 4, text: 'Absolutely. Tuesday at 14:00 JST works perfectly for our team.', from: 'me', read: true, time: { k: 'clock', s: '09:50' }, translations: { ko: '물론입니다. 화요일 14:00 JST가 저희 팀에 완벽합니다.', ja: 'もちろんです。火曜日の14:00 JSTは弊社チームに最適です。', zh: '当然。周二14:00 JST对我们团队来说完全没问题。', pt: 'Com certeza. Terça-feira às 14:00 JST é perfeito para nossa equipe.', es: 'Por supuesto. El martes a las 14:00 JST es perfecto para nuestro equipo.' } },
      { id: 5, text: 'パートナーシップを推進することに大変興味を持っております。', from: 'them', read: false, time: { k: 'clock', s: '10:02' }, translations: { en: 'We are very interested in moving forward with the partnership.', ko: '저희는 파트너십을 진행하는 데 매우 관심이 있습니다.', zh: '我们对推进合作关系非常感兴趣。', pt: 'Temos muito interesse em avançar com a parceria.', es: 'Estamos muy interesados en avanzar con la asociación.' } },
    ],
  },
  {
    id: 2, name: 'SkyTech Solutions', country: 'USA', flag: '🇺🇸', avatar: 'ST', color: '#F0FDF4',
    lastMessage: 'The Q3 report looks great! Lets sync tomorrow.',
    time: { k: 'hr', n: 1 },
    messages: [
      { id: 1, text: 'Hey! The Q3 report you shared looks outstanding.', from: 'them', read: true, time: { k: 'clock', s: '08:30' }, translations: { ko: '안녕하세요! 공유해 주신 3분기 보고서가 정말 훌륭합니다.', ja: 'こんにちは！共有していただいたQ3レポートは素晴らしい内容です。', zh: '嘿！您分享的Q3报告看起来非常出色。', pt: 'Olá! O relatório do Q3 que você compartilhou está excelente.', es: '¡Hola! El informe del Q3 que compartiste se ve excelente.' } },
      { id: 2, text: 'Glad you liked it! Our team put in a lot of work this quarter.', from: 'me', read: true, time: { k: 'clock', s: '08:45' }, translations: { ko: '마음에 드셨다니 기쁩니다! 저희 팀이 이번 분기에 정말 열심히 일했습니다.', ja: '気に入っていただけて嬉しいです！今四半期、チームが本当に頑張りました。', zh: '很高兴您喜欢！我们团队这个季度付出了很多努力。', pt: 'Fico feliz que você gostou! Nossa equipe trabalhou muito neste trimestre.', es: '¡Me alegra que te haya gustado! Nuestro equipo trabajó mucho este trimestre.' } },
      { id: 3, text: 'The Q3 report looks great! Lets sync tomorrow at 10 AM PST?', from: 'them', read: false, time: { k: 'clock', s: '09:15' }, translations: { ko: '3분기 보고서가 훌륭합니다! 내일 오전 10시 PST에 싱크 맞춰볼까요?', ja: 'Q3レポートは素晴らしいです！明日PST午前10時に同期しませんか？', zh: 'Q3报告看起来很棒！明天太平洋时间上午10点同步一下？', pt: 'O relatório do Q3 está ótimo! Vamos sincronizar amanhã às 10h PST?', es: '¡El informe del Q3 se ve genial! ¿Sincronizamos mañana a las 10 AM PST?' } },
    ],
  },
  {
    id: 3, name: 'BeiJing Innovations', country: 'China', flag: '🇨🇳', avatar: 'BI', color: '#FFF7ED',
    lastMessage: '合同条款需要进一步讨论。我们明天再谈？',
    time: { k: 'hr', n: 3 },
    messages: [
      { id: 1, text: '您好，关于合同条款，我们有一些问题需要确认。', from: 'them', read: true, time: { k: 'clock', s: '07:00' }, translations: { en: 'Hello, we have some questions to confirm regarding the contract terms.', ko: '안녕하세요, 계약 조항과 관련하여 확인해야 할 몇 가지 사항이 있습니다.', ja: 'こんにちは、契約条件についていくつか確認したい点がございます。', pt: 'Olá, temos algumas perguntas para confirmar sobre os termos do contrato.', es: 'Hola, tenemos algunas preguntas para confirmar sobre los términos del contrato.' } },
      { id: 2, text: 'Of course, please share your concerns and we will address them.', from: 'me', read: true, time: { k: 'clock', s: '07:30' }, translations: { ko: '물론입니다. 우려 사항을 공유해 주시면 해결해 드리겠습니다.', ja: 'もちろんです。ご懸念事項をお知らせいただければ対応いたします。', zh: '当然，请分享您的顾虑，我们会加以处理。', pt: 'Claro, compartilhe suas preocupações e iremos resolvê-las.', es: 'Por supuesto, comparta sus preocupaciones y las abordaremos.' } },
      { id: 3, text: '合同条款需要进一步讨论。我们明天再谈？', from: 'them', read: true, time: { k: 'clock', s: '08:00' }, translations: { en: 'The contract terms need further discussion. Shall we talk again tomorrow?', ko: '계약 조항에 대해 추가 논의가 필요합니다. 내일 다시 이야기할까요?', ja: '契約条件についてさらに議論が必要です。明日また話しましょうか？', pt: 'Os termos do contrato precisam de mais discussão. Podemos conversar amanhã?', es: 'Los términos del contrato necesitan más discusión. ¿Hablamos de nuevo mañana?' } },
    ],
  },
  {
    id: 4, name: 'Nexus Tecnologia', country: 'Brazil', flag: '🇧🇷', avatar: 'NT', color: '#F0F9FF',
    lastMessage: 'Precisamos alinhar os detalhes do contrato antes do prazo.',
    time: { k: 'yday' },
    messages: [
      { id: 1, text: 'Olá! Ficamos muito animados com nossa colaboração.', from: 'them', read: true, time: { k: 'yday' }, translations: { en: 'Hello! We are very excited about our collaboration.', ko: '안녕하세요! 저희는 협업에 매우 설레고 있습니다.', ja: 'こんにちは！私たちのコラボレーションにとても興奮しています。', zh: '你好！我们对我们的合作感到非常兴奋。', es: '¡Hola! Estamos muy emocionados con nuestra colaboración.' } },
      { id: 2, text: 'We are equally excited! Brazil is a very important market for us.', from: 'me', read: true, time: { k: 'yday' }, translations: { ko: '저희도 마찬가지입니다! 브라질은 저희에게 매우 중요한 시장입니다.', ja: '私どもも同様に興奮しています！ブラジルは大変重要な市場です。', zh: '我们同样感到兴奋！巴西对我们来说是非常重要的市场。', pt: 'Estamos igualmente empolgados! O Brasil é um mercado muito importante para nós.', es: '¡Estamos igualmente emocionados! Brasil es un mercado muy importante para nosotros.' } },
      { id: 3, text: 'Precisamos alinhar os detalhes do contrato antes do prazo.', from: 'them', read: true, time: { k: 'yday' }, translations: { en: 'We need to align the contract details before the deadline.', ko: '마감 전에 계약 세부 사항을 조율해야 합니다.', ja: '期限前に契約の詳細を調整する必要があります。', zh: '我们需要在截止日期前对齐合同细节。', es: 'Necesitamos alinear los detalles del contrato antes del plazo.' } },
    ],
  },
  {
    id: 5, name: 'Innovatech Madrid', country: 'Spain', flag: '🇪🇸', avatar: 'IM', color: '#FDF4FF',
    lastMessage: 'La reunión fue muy productiva. ¡Gracias!',
    time: { k: 'days', n: 2 },
    messages: [
      { id: 1, text: '¡Buenos días! La presentación de ayer fue excelente.', from: 'them', read: true, time: { k: 'days', n: 2 }, translations: { en: "Good morning! Yesterday's presentation was excellent.", ko: '좋은 아침입니다! 어제 프레젠테이션이 정말 훌륭했습니다.', ja: 'おはようございます！昨日のプレゼンテーションは素晴らしかったです。', zh: '早上好！昨天的演示非常出色。', pt: 'Bom dia! A apresentação de ontem foi excelente.' } },
      { id: 2, text: 'Muchas gracias. We worked very hard on preparing it for your team.', from: 'me', read: true, time: { k: 'days', n: 2 }, translations: { ko: '감사합니다. 귀팀을 위해 정말 열심히 준비했습니다.', ja: 'ありがとうございます。御社チームのために一生懸命準備いたしました。', zh: '非常感谢。我们为贵团队的准备工作付出了很多努力。', pt: 'Muito obrigado. Trabalhamos muito para preparar isso para sua equipe.', es: 'Muchas gracias. Trabajamos muy duro para prepararlo para su equipo.' } },
      { id: 3, text: 'La reunión fue muy productiva. ¡Gracias!', from: 'them', read: true, time: { k: 'days', n: 2 }, translations: { en: 'The meeting was very productive. Thank you!', ko: '회의가 매우 생산적이었습니다. 감사합니다!', ja: '会議はとても生産的でした。ありがとうございます！', zh: '会议非常富有成效。谢谢！', pt: 'A reunião foi muito produtiva. Obrigado!' } },
    ],
  },
]

interface Trip {
  id: number; country: string; flag: string; city: string
  date: string; status: TripStatus; purpose: string
}

const TRIPS_INIT: Trip[] = [
  { id: 1, country: 'Japan', flag: '🇯🇵', city: 'Tokyo', date: 'Aug 15–20, 2026', status: 'upcoming', purpose: 'Partnership Summit' },
  { id: 2, country: 'USA', flag: '🇺🇸', city: 'San Francisco', date: 'Aug 5–8, 2026', status: 'inProgress', purpose: 'Tech Conference' },
  { id: 3, country: 'Germany', flag: '🇩🇪', city: 'Berlin', date: 'Jul 20–24, 2026', status: 'completed', purpose: 'Enterprise Deal' },
  { id: 4, country: 'China', flag: '🇨🇳', city: 'Shanghai', date: 'Sep 3–7, 2026', status: 'upcoming', purpose: 'Manufacturing Review' },
  { id: 5, country: 'Brazil', flag: '🇧🇷', city: 'São Paulo', date: 'Sep 14–18, 2026', status: 'upcoming', purpose: 'Market Expansion' },
]

const TRIP_COUNTRIES = [
  { name: 'Japan', flag: '🇯🇵' }, { name: 'USA', flag: '🇺🇸' }, { name: 'China', flag: '🇨🇳' },
  { name: 'Germany', flag: '🇩🇪' }, { name: 'Brazil', flag: '🇧🇷' }, { name: 'France', flag: '🇫🇷' },
  { name: 'UK', flag: '🇬🇧' }, { name: 'India', flag: '🇮🇳' }, { name: 'Singapore', flag: '🇸🇬' },
  { name: 'Australia', flag: '🇦🇺' }, { name: 'Canada', flag: '🇨🇦' }, { name: 'Spain', flag: '🇪🇸' },
  { name: 'Mexico', flag: '🇲🇽' }, { name: 'Korea', flag: '🇰🇷' }, { name: 'Thailand', flag: '🇹🇭' },
  { name: 'UAE', flag: '🇦🇪' },
]

// ─── AI Responses ─────────────────────────────────────────────────────────────
const AI_TONE: Record<Lang, string> = {
  en: "I wanted to take this opportunity to express our sincere appreciation for the proposal. We are highly enthusiastic about the potential for a mutually beneficial partnership.",
  ko: "이번 제안에 대해 진심으로 감사드립니다. 상호 유익한 파트너십의 가능성에 매우 기대가 큽니다.",
  ja: "このたびはご提案をいただき、誠にありがとうございます。相互に有益なパートナーシップの可能性に大変期待しております。",
  zh: "感谢您的提案，我们对建立互惠合作关系的可能性充满期待。",
  pt: "Gostaria de expressar nossa sincera gratidão pela proposta. Estamos muito entusiasmados com o potencial de uma parceria mutuamente benéfica.",
  es: "Quería aprovechar esta oportunidad para expresar nuestro sincero agradecimiento por la propuesta. Estamos muy entusiasmados con el potencial de una asociación mutuamente beneficiosa.",
}
const AI_TRANSLATE: Record<Lang, string> = {
  en: "Translation (JA → EN): Thank you for your partnership proposal. We are very interested and would like to discuss the next steps.",
  ko: "번역 (JA → KO): 파트너십 제안에 감사드립니다. 매우 관심이 있으며, 다음 단계에 대해 논의하고 싶습니다.",
  ja: "[JA 原文確認] パートナーシップのご提案ありがとうございます。大変興味深く、次のステップについて話し合いたいと思います。",
  zh: "翻译 (JA → ZH): 感谢您的合作提案。我们非常感兴趣，希望讨论下一步事宜。",
  pt: "Tradução (JA → PT): Obrigado pela sua proposta de parceria. Estamos muito interessados e gostaríamos de discutir os próximos passos.",
  es: "Traducción (JA → ES): Gracias por su propuesta de asociación. Estamos muy interesados y nos gustaría discutir los próximos pasos.",
}
const AI_CULTURAL: Record<Lang, string> = {
  en: '🏮 Cultural Insight — Japan: Decision-making is consensus-driven ("nemawashi"). Patience is key — pushing for fast decisions signals disrespect.',
  ko: "🏮 일본 문화 인사이트: 의사결정은 합의 방식(네마와시)으로 이루어집니다. 빠른 결정을 요구하면 무례하게 보일 수 있습니다.",
  ja: "🏮 文化的インサイト：日本のビジネスでは「根回し」が重要です。素早い意思決定を求めると失礼になります。",
  zh: "🏮 文化洞察 — 日本：决策采用共识驱动方式（根回し）。急于求成会显得无礼。",
  pt: "🏮 Insight Cultural — Japão: A tomada de decisão é orientada por consenso (\"nemawashi\"). A paciência é essencial.",
  es: "🏮 Perspectiva Cultural — Japón: La toma de decisiones es por consenso (\"nemawashi\"). La paciencia es clave.",
}

// ─── AI Processing Helpers ────────────────────────────────────────────────────
const TONE_OPENER: Record<Lang, string> = {
  en: 'I hope this message finds you well. I would like to formally convey that ',
  ko: '안녕하세요. 다음 사항을 정중히 전달드리고자 합니다. ',
  ja: 'お世話になっております。以下についてご連絡申し上げます。',
  zh: '您好，我想正式告知您以下事项：',
  pt: 'Espero que esteja bem. Gostaria de comunicar formalmente que ',
  es: 'Espero que se encuentre bien. Me gustaría comunicarle formalmente que ',
}
const TONE_CLOSER: Record<Lang, string> = {
  en: ' I appreciate your attention to this matter and look forward to your valued response.',
  ko: ' 이 사항에 주의를 기울여 주셔서 감사드리며, 귀하의 소중한 답변을 기대합니다.',
  ja: 'ご確認のほど、よろしくお願いいたします。ご返答をお待ち申し上げております。',
  zh: '感谢您对此事的关注，期待您的宝贵回复。',
  pt: ' Agradeço sua atenção a este assunto e aguardo seu retorno.',
  es: ' Agradezco su atención a este asunto y espero su respuesta.',
}
const TRANSLATE_LABEL: Record<Lang, string> = {
  en: '🌐 [Auto-translated]\n', ko: '🌐 [자동 번역됨]\n',
  ja: '🌐 [自動翻訳済み]\n', zh: '🌐 [自动翻译]\n',
  pt: '🌐 [Tradução automática]\n', es: '🌐 [Traducción automática]\n',
}
const CULTURAL_BY_COUNTRY: Record<string, Record<Lang, string>> = {
  Japan: {
    en: '🏮 Cultural Note (Japan): Decision-making is consensus-driven ("nemawashi"). Be patient — pushing for fast decisions signals disrespect. Always use formal titles.',
    ko: '🏮 일본 문화 노트: 의사결정은 합의(네마와시) 방식입니다. 빠른 결정을 강요하면 실례가 됩니다. 항상 공식 호칭을 사용하세요.',
    ja: '🏮 文化メモ（日本）：意思決定は「根回し」による合意形成です。早急な決定を求めると失礼になります。常に敬称を使いましょう。',
    zh: '🏮 文化提示（日本）：决策采用协商一致的"根回し"方式。急于求成会显得无礼。请始终使用正式称谓。',
    pt: '🏮 Nota Cultural (Japão): A tomada de decisão é consensual ("nemawashi"). Seja paciente — exigir decisões rápidas é desrespeitoso. Use sempre títulos formais.',
    es: '🏮 Nota Cultural (Japón): La toma de decisiones es consensual ("nemawashi"). Sea paciente — exigir decisiones rápidas es irrespetuoso. Use siempre títulos formales.',
  },
  USA: {
    en: '🌟 Cultural Note (USA): Be direct and concise. Time is money — get to the point quickly. Firm handshakes and direct eye contact are expected.',
    ko: '🌟 미국 문화 노트: 직접적이고 간결하게 소통하세요. 시간은 돈입니다. 굳은 악수와 직접적인 눈 맞춤이 기대됩니다.',
    ja: '🌟 文化メモ（米国）：直接的で簡潔にコミュニケーションしましょう。時間はお金です。力強い握手と直接的なアイコンタクトが求められます。',
    zh: '🌟 文化提示（美国）：直接简洁地沟通。时间就是金钱。期待坚定的握手和直接的眼神接触。',
    pt: '🌟 Nota Cultural (EUA): Seja direto e conciso. Tempo é dinheiro. Aperto de mão firme e contato visual direto são esperados.',
    es: '🌟 Nota Cultural (EE.UU.): Sea directo y conciso. El tiempo es dinero. Se esperan apretones de manos firmes y contacto visual directo.',
  },
  China: {
    en: '🐉 Cultural Note (China): Build "guanxi" (relationships) before business. Face-saving is crucial — never embarrass a partner publicly. Patience is key in negotiations.',
    ko: '🐉 중국 문화 노트: 비즈니스 전에 "관시"(관계)를 구축하세요. 체면이 중요합니다. 협상에서 인내심이 핵심입니다.',
    ja: '🐉 文化メモ（中国）：ビジネス前に「グァンシー（関係）」を築きましょう。面子が重要です。交渉では忍耐が鍵です。',
    zh: '🐉 文化提示（中国）：做生意前先建立"关系"。面子至关重要。谈判中耐心是关键。',
    pt: '🐉 Nota Cultural (China): Construa "guanxi" antes dos negócios. Salvar as aparências é crucial. A paciência é fundamental nas negociações.',
    es: '🐉 Nota Cultural (China): Construye "guanxi" antes de los negocios. Salvar las apariencias es crucial. La paciencia es clave en las negociaciones.',
  },
  Brazil: {
    en: '🌺 Cultural Note (Brazil): Relationship-first culture — small talk is essential. Meetings often start 15–30 minutes late. Be warm, expressive, and sociable.',
    ko: '🌺 브라질 문화 노트: 관계 우선 문화입니다. 잡담이 필수적입니다. 회의는 15~30분 늦게 시작되는 경우가 많습니다.',
    ja: '🌺 文化メモ（ブラジル）：関係優先文化です。世間話が不可欠です。会議は15〜30分遅れて始まることが多いです。',
    zh: '🌺 文化提示（巴西）：关系优先的文化，闲聊必不可少。会议通常晚15-30分钟开始。要热情、友善。',
    pt: '🌺 Nota Cultural (Brasil): Cultura de relacionamento primeiro. A conversa informal é essencial. As reuniões geralmente começam 15 a 30 minutos atrasadas.',
    es: '🌺 Nota Cultural (Brasil): Cultura de relaciones primero. La charla es esencial. Las reuniones a menudo comienzan 15-30 minutos tarde.',
  },
  Germany: {
    en: '🦅 Cultural Note (Germany): Punctuality is non-negotiable. Use formal titles (Herr/Frau) until invited otherwise. Data and facts are valued over opinions.',
    ko: '🦅 독일 문화 노트: 시간 엄수는 필수입니다. 허락 전까지 공식 호칭(Herr/Frau)을 사용하세요. 데이터와 사실이 의견보다 중시됩니다.',
    ja: '🦅 文化メモ（ドイツ）：時間厳守は絶対です。許可されるまで正式な敬称（Herr/Frau）を使いましょう。意見よりデータが重視されます。',
    zh: '🦅 文化提示（德国）：守时是必须的。在被邀请之前使用正式称谓（Herr/Frau）。数据和事实比意见更受重视。',
    pt: '🦅 Nota Cultural (Alemanha): A pontualidade é inegociável. Use títulos formais (Herr/Frau) até ser convidado a usar o primeiro nome. Dados e fatos são valorizados.',
    es: '🦅 Nota Cultural (Alemania): La puntualidad es innegociable. Use títulos formales (Herr/Frau) hasta que le inviten a usar el nombre de pila. Los datos se valoran.',
  },
}

function processAITone(text: string, lang: Lang): string {
  const lower = text.charAt(0).toLowerCase() + text.slice(1)
  return TONE_OPENER[lang] + lower + TONE_CLOSER[lang]
}

function processAITranslate(text: string, fromLang: Lang, toLang: Lang): string {
  const label = TRANSLATE_LABEL[toLang]
  const langNames: Record<Lang, string> = { en: 'EN', ko: 'KO', ja: 'JA', zh: 'ZH', pt: 'PT', es: 'ES' }
  return `${label}(${langNames[fromLang]} → ${langNames[toLang]}): ${text}`
}

function processAICultural(text: string, country: string, lang: Lang): string {
  const tip = CULTURAL_BY_COUNTRY[country]?.[lang] ?? AI_CULTURAL[lang]
  return `${tip}\n\n— Message context: "${text.slice(0, 80)}${text.length > 80 ? '...' : ''}"`
}

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  primary: 'var(--c-primary)', primaryLight: 'var(--c-primary-light)', primaryDark: 'var(--c-primary-dark)',
  bg: 'var(--c-bg)', surface: 'var(--c-surface)', surface2: 'var(--c-surface2)',
  border: 'var(--c-border)', text: 'var(--c-text)', sub: 'var(--c-sub)', muted: 'var(--c-muted)',
  success: 'var(--c-success)', warning: 'var(--c-warning)', error: 'var(--c-error)',
}
const CV = {
  overlay: 'var(--c-overlay)', cardInner: 'var(--c-card-inner)',
  toastBg: 'var(--c-toast-bg)', toastText: 'var(--c-toast-text)', profileGrad: 'var(--c-profile-grad)',
  blueTint: 'var(--c-blue-tint)', greenTint: 'var(--c-green-tint)', yellowTint: 'var(--c-yellow-tint)',
  purpleTint: 'var(--c-purple-tint)', redTint: 'var(--c-red-tint)', redBorder: 'var(--c-red-border)',
  highBg: 'var(--c-high-bg)', highText: 'var(--c-high-text)',
  mediumBg: 'var(--c-medium-bg)', mediumText: 'var(--c-medium-text)',
  lowBg: 'var(--c-low-bg)', lowText: 'var(--c-low-text)',
  successBg: 'var(--c-success-bg)', successBorder: 'var(--c-success-border-col)',
  successTitle: 'var(--c-success-title)', successBody: 'var(--c-success-body)',
  checkBg: 'var(--c-check-bg)', checkStroke: 'var(--c-check-stroke)',
  inProgressBg: 'var(--c-inprogress-bg)', inProgressText: 'var(--c-inprogress-text)',
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Toast({ msg }: { msg: string }) {
  if (!msg) return null
  return (
    <div className="anim-toast" style={{ position: 'absolute', top: 60, left: '50%', background: CV.toastBg, color: CV.toastText, padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 500, zIndex: 9999, whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>✓ {msg}</div>
  )
}

function Btn({ label, onClick, variant = 'primary', full = true, small = false }: {
  label: string; onClick: () => void; variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  full?: boolean; small?: boolean
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: `linear-gradient(135deg, #3B62D0 0%, #052659 100%)`, color: '#fff', border: 'none', boxShadow: '0 4px 16px rgba(5,38,89,0.30)' },
    outline:  { background: 'transparent', color: C.primary, border: `1.5px solid ${C.primary}` },
    ghost:    { background: C.surface, color: C.text, border: `1px solid ${C.border}` },
    danger:   { background: CV.redTint, color: C.error, border: `1.5px solid ${CV.redBorder}` },
  }
  return (
    <button onClick={onClick} style={{ ...styles[variant], width: full ? '100%' : 'auto', padding: small ? '8px 16px' : '15px 24px', borderRadius: 100, fontSize: small ? 13 : 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)', letterSpacing: '0.01em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>{label}</button>
  )
}

function Input({ label, type = 'text', value, onChange, placeholder }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: C.sub }}>{label}</label>
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        style={{ padding: '13px 18px', borderRadius: 100, border: `1.5px solid ${C.border}`, background: '#fff', fontSize: 15, color: C.text, fontFamily: 'var(--font)', outline: 'none', boxShadow: '0 1px 4px rgba(5,38,89,0.06)' }}
        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#3B62D0'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(59,98,208,0.12)' }}
        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = ''; (e.target as HTMLInputElement).style.boxShadow = '0 1px 4px rgba(5,38,89,0.06)' }} />
    </div>
  )
}

function StatusBar({ time = '9:41 AM', dark = false }: { time?: string; dark?: boolean }) {
  const fg = dark ? 'rgba(255,255,255,0.9)' : C.text
  return (
    <div style={{ height: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px 8px', flexShrink: 0, background: 'transparent', position: 'relative', zIndex: 1 }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: fg, letterSpacing: '-0.02em' }}>{time}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><rect x="0" y="8" width="3" height="4" rx="1" fill={fg} /><rect x="4.5" y="5" width="3" height="7" rx="1" fill={fg} /><rect x="9" y="2" width="3" height="10" rx="1" fill={fg} /><rect x="13.5" y="0" width="2.5" height="12" rx="1" fill={fg} /></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 2C5.2 2 2.7 3.2 1 5.2L2.5 6.7C3.8 5.1 5.8 4 8 4s4.2 1.1 5.5 2.7L15 5.2C13.3 3.2 10.8 2 8 2z" fill={fg} /><path d="M8 6C6.2 6 4.5 6.8 3.4 8.1L4.9 9.6C5.7 8.6 6.8 8 8 8s2.3.6 3.1 1.6l1.5-1.5C11.5 6.8 9.8 6 8 6z" fill={fg} /><circle cx="8" cy="12" r="1.5" fill={fg} /></svg>
        <div style={{ display: 'flex', gap: 1, alignItems: 'center' }}><div style={{ width: 22, height: 11, borderRadius: 3, border: `1.5px solid ${fg}`, padding: 1.5, display: 'flex', alignItems: 'center' }}><div style={{ width: '80%', height: '100%', background: fg, borderRadius: 1.5 }} /></div><div style={{ width: 2, height: 5, background: fg, borderRadius: 1, marginLeft: 1 }} /></div>
      </div>
    </div>
  )
}

function HomeIndicator() {
  return (
    <div style={{ height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ width: 134, height: 5, background: C.text, borderRadius: 100, opacity: 0.18 }} />
    </div>
  )
}

function Avatar({ initials, color: _color, size = 44 }: { initials: string; color?: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size / 2, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.3, fontWeight: 700, color: C.primary, flexShrink: 0, border: `1.5px solid ${C.border}`, boxShadow: '0 2px 8px rgba(5,38,89,0.10)' }}>{initials}</div>
  )
}

// ─── Splash ───────────────────────────────────────────────────────────────────
function SplashScreen({ lang, onStart }: { lang: Lang; onStart: () => void }) {
  const t = (k: string) => i18n(lang, k)
  return (
    <div className="anim-fade" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(165deg, #021024 0%, #052659 45%, #3B62D0 80%, #5483B3 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative spheres */}
      <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle at 38% 38%, #C1E8FF 0%, #7DA0CA 50%, #3B62D0 100%)', top: -40, right: -40, opacity: 0.85 }} />
      <div style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle at 35% 32%, rgba(255,255,255,0.9) 0%, #7DA0CA 45%, #052659 100%)', top: 80, right: 60, opacity: 0.75 }} />
      <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #7DA0CA 0%, #3B62D0 50%, #052659 100%)', top: 100, left: -80, opacity: 0.70 }} />
      <div style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle at 38% 35%, #C1E8FF 0%, #5483B3 60%, #021024 100%)', bottom: 220, left: 20, opacity: 0.65 }} />
      <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #3B62D0 0%, #052659 70%)', bottom: 160, right: -50, opacity: 0.55 }} />
      <StatusBar time="9:41 AM" dark />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
        <div style={{ width: 88, height: 88, borderRadius: 28, background: 'rgba(193,232,255,0.15)', backdropFilter: 'blur(20px)', border: '1px solid rgba(193,232,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, boxShadow: '0 8px 32px rgba(5,38,89,0.3)' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="white" strokeWidth="1.5" strokeDasharray="3 2" /><ellipse cx="24" cy="24" rx="9" ry="20" stroke="white" strokeWidth="1.5" /><line x1="4" y1="24" x2="44" y2="24" stroke="white" strokeWidth="1.5" /><path d="M24 4C24 4 32 12 32 24C32 36 24 44 24 44" stroke="rgba(193,232,255,0.8)" strokeWidth="1.5" /><circle cx="24" cy="24" r="4" fill="white" /><circle cx="24" cy="24" r="2" fill="#3B62D0" /></svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', color: 'rgba(193,232,255,0.85)', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase' }}>{t('splashBadge')}</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1.15, letterSpacing: '-0.02em' }}>{t('appName')}</h1>
          <p style={{ fontSize: 16, color: 'rgba(193,232,255,0.80)', marginTop: 14, lineHeight: 1.55 }}>{t('tagline')}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
          {(['featTranslation', 'featCulture', 'featMeetings'] as const).map(k => (
            <div key={k} style={{ padding: '7px 16px', borderRadius: 100, background: 'rgba(193,232,255,0.14)', border: '1px solid rgba(193,232,255,0.25)', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{t(k)}</div>
          ))}
        </div>
      </div>
      <div style={{ padding: '0 24px 16px' }}>
        <button onClick={onStart} style={{ width: '100%', padding: '16px', borderRadius: 100, background: '#fff', color: '#052659', border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)', boxShadow: '0 4px 20px rgba(5,38,89,0.25)', letterSpacing: '0.01em' }}>{t('getStarted')}</button>
        <p style={{ textAlign: 'center', color: 'rgba(193,232,255,0.5)', fontSize: 12, marginTop: 12 }}>{t('splashTrusted')}</p>
      </div>
      <HomeIndicator />
    </div>
  )
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ lang, savedUser, onLogin, onSignUp, showToast }: {
  lang: Lang; savedUser: { email: string; password: string } | null
  onLogin: () => void; onSignUp: () => void; showToast: (msg: string) => void
}) {
  const t = (k: string) => i18n(lang, k)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    setError('')
    if (!email || !pass) return
    if (savedUser && email === savedUser.email && pass === savedUser.password) {
      showToast(t('loginSuccess'))
      setTimeout(onLogin, 900)
    } else {
      setError(t('loginError'))
    }
  }

  return (
    <div className="anim-fade" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(165deg, #021024 0%, #052659 40%, #3B62D0 75%, #5483B3 100%)', minHeight: 0, position: 'relative', overflow: 'hidden' }}>
      <StatusBar time="9:41 AM" dark />
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: C.bg, borderRadius: '28px 28px 0 0', marginTop: 48, padding: '28px 24px 40px', boxShadow: '0 -8px 40px rgba(5,38,89,0.2)' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: C.text, margin: '0 0 8px', letterSpacing: '-0.02em', textAlign: 'center' }}>{t('welcomeBack')}</h1>
        <p style={{ fontSize: 14, color: C.sub, margin: '0 0 28px', lineHeight: 1.5, textAlign: 'center' }}>{t('loginSubtitle')}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 8 }}>
          <Input label={t('email')} type="email" value={email} onChange={v => { setEmail(v); setError('') }} placeholder={t('emailPlaceholder')} />
          <Input label={t('password')} type="password" value={pass} onChange={v => { setPass(v); setError('') }} placeholder={t('passwordPlaceholder')} />
        </div>
        {error && (
          <div style={{ padding: '10px 14px', borderRadius: 10, background: CV.redTint, border: `1px solid ${CV.redBorder}`, marginBottom: 12, fontSize: 13, color: C.error, fontWeight: 500 }}>
            {error}
          </div>
        )}
        <div style={{ textAlign: 'right', marginBottom: error ? 16 : 28 }}>
          <span style={{ fontSize: 13, color: C.primary, fontWeight: 600, cursor: 'pointer' }}>{t('forgotPassword')}</span>
        </div>
        <Btn label={t('logIn')} onClick={handleLogin} />
        <p style={{ textAlign: 'center', fontSize: 14, color: C.sub, marginTop: 24 }}>
          {t('noAccount')}{' '}<span onClick={onSignUp} style={{ color: C.primary, fontWeight: 700, cursor: 'pointer' }}>{t('signUp')}</span>
        </p>
      </div>
      <HomeIndicator />
    </div>
  )
}

// ─── Sign Up ──────────────────────────────────────────────────────────────────
interface SignupData { name: string; company: string; email: string; password: string }

function SignUpScreen({ lang, onCreated, onBack, showToast }: { lang: Lang; onCreated: (data: SignupData) => void; onBack: () => void; showToast: (msg: string) => void }) {
  const t = (k: string) => i18n(lang, k)
  const [name, setName] = useState(''); const [company, setCompany] = useState('')
  const [email, setEmail] = useState(''); const [pass, setPass] = useState(''); const [confirm, setConfirm] = useState('')
  const handleCreate = () => { showToast(t('registrationSuccess')); setTimeout(() => onCreated({ name, company, email, password: pass }), 900) }
  return (
    <div className="anim-slide" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'linear-gradient(165deg, #021024 0%, #052659 40%, #3B62D0 75%, #5483B3 100%)', minHeight: 0, position: 'relative', overflow: 'hidden' }}>
      <StatusBar time="9:41 AM" dark />
      <div style={{ padding: '8px 20px 0', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', width: 36, height: 36, borderRadius: 100, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#fff' }}>‹</button>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{t('createAccountTitle')}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: C.bg, borderRadius: '28px 28px 0 0', marginTop: 60, padding: '24px 24px 32px', boxShadow: '0 -8px 40px rgba(5,38,89,0.2)' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, margin: 0, textAlign: 'center' }}>{t('joinNetwork')}</h1>
          <p style={{ fontSize: 14, color: C.sub, marginTop: 6, lineHeight: 1.5, textAlign: 'center' }}>{t('signupSubtitle')}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          <Input label={t('fullName')} value={name} onChange={setName} placeholder={t('namePlaceholder')} />
          <Input label={t('companyName')} value={company} onChange={setCompany} placeholder={t('companyPlaceholder')} />
          <Input label={t('email')} type="email" value={email} onChange={setEmail} placeholder={t('emailPlaceholder')} />
          <Input label={t('password')} type="password" value={pass} onChange={setPass} placeholder={t('createPasswordPlaceholder')} />
          <Input label={t('confirmPassword')} type="password" value={confirm} onChange={setConfirm} placeholder={t('confirmPasswordPlaceholder')} />
        </div>
        <Btn label={t('createAccount')} onClick={handleCreate} />
        <p style={{ textAlign: 'center', fontSize: 14, color: C.sub, marginTop: 24 }}>
          {t('alreadyAccount')}{' '}<span style={{ color: C.primary, fontWeight: 700, cursor: 'pointer' }} onClick={onBack}>{t('signIn')}</span>
        </p>
      </div>
      <HomeIndicator />
    </div>
  )
}

// ─── Language Select ──────────────────────────────────────────────────────────
function LangSelectScreen({ lang, onSelect, onBack, isSettings = false }: { lang: Lang; onSelect: (l: Lang) => void; onBack?: () => void; isSettings?: boolean }) {
  const t = (k: string) => i18n(lang, k)
  const [selected, setSelected] = useState<Lang>(lang)
  return (
    <div className="anim-slide" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.bg, minHeight: 0 }}>
      <StatusBar />
      {isSettings && (
        <div style={{ padding: '4px 24px 0', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: C.surface, border: `1px solid ${C.border}`, width: 36, height: 36, borderRadius: 100, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: C.text }}>‹</button>
          <span style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{t('langSettings')}</span>
        </div>
      )}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px' }}>
        {!isSettings && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, fontSize: 24 }}>🌐</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>{t('chooseLanguage')}</h1>
            <p style={{ fontSize: 14, color: C.sub, marginTop: 8 }}>{t('langSubtitle')}</p>
          </div>
        )}
        {isSettings && <div style={{ marginBottom: 24 }}><p style={{ fontSize: 14, color: C.sub }}>{t('chooseLanguage')}</p></div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {LANGUAGES.map(l => {
            const active = selected === l.code
            return (
              <button key={l.code} onClick={() => setSelected(l.code)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', borderRadius: 16, border: `2px solid ${active ? C.primary : C.border}`, background: active ? C.primaryLight : C.surface, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                <span style={{ fontSize: 28, color: C.text }}>{l.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{l.name}</div>
                  <div style={{ fontSize: 13, color: C.sub }}>{l.native}</div>
                </div>
                {active && <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div>}
              </button>
            )
          })}
        </div>
        <Btn label={t('confirmSelection')} onClick={() => onSelect(selected)} />
      </div>
      <HomeIndicator />
    </div>
  )
}

// ─── Chat List ────────────────────────────────────────────────────────────────
function ChatListScreen({ lang, convos, onOpen }: { lang: Lang; convos: Convo[]; onOpen: (c: Convo) => void }) {
  const t = (k: string) => i18n(lang, k)
  const [search, setSearch] = useState('')
  const filtered = convos.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase()))
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px 12px', background: C.bg, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: '-0.03em' }}>{t('messages')}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ width: 36, height: 36, borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke={C.sub} strokeWidth="1.5" /><path d="M8 5v3l2 2" stroke={C.sub} strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <button style={{ width: 36, height: 36, borderRadius: 10, background: C.primary, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5.5" stroke={C.muted} strokeWidth="1.5" /><path d="M11 11l2.5 2.5" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" /></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('search')} style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 100, border: `1.5px solid ${C.border}`, background: '#fff', fontSize: 14, color: C.text, fontFamily: 'var(--font)', outline: 'none', boxSizing: 'border-box', boxShadow: '0 1px 4px rgba(5,38,89,0.06)' }} />
        </div>
      </div>
      <div style={{ flex: 1, padding: '0 0 20px' }}>
        {filtered.map(c => (
          <button key={c.id} onClick={() => onOpen(c)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${C.border}`, cursor: 'pointer', textAlign: 'left' }}>
            <Avatar initials={c.avatar} color={c.color} size={48} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{c.name}</span>
                <span style={{ fontSize: 12, color: C.muted }}>{fmtTime(c.time, lang)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: C.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{c.lastMessage}</span>
                {(() => { const n = countUnread(c); return n > 0 ? (<div style={{ minWidth: 20, height: 20, borderRadius: 100, background: C.primary, color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px', flexShrink: 0 }}>{n}</div>) : null })()}
              </div>
              <div style={{ marginTop: 4 }}>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: C.surface2, color: C.sub, fontWeight: 500 }}>{c.flag} {c.country}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Chat Detail ──────────────────────────────────────────────────────────────
function ChatDetailScreen({ lang, convo, onBack, showToast, onMarkRead, onSendMessage }: {
  lang: Lang; convo: Convo; onBack: () => void; showToast: (msg: string) => void
  onMarkRead: () => void; onSendMessage: (msg: Message) => void
}) {
  const t = (k: string) => i18n(lang, k)
  const [msg, setMsg] = useState('')
  const [translatedIds, setTranslatedIds] = useState<Set<number>>(new Set())
  const [aiProcessing, setAiProcessing] = useState(false)
  const [aiHint, setAiHint] = useState('')
  const [culturalTip, setCulturalTip] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pLang = partnerLang(convo.country)
  const showAutoTranslateBadge = lang !== pLang

  useEffect(() => { onMarkRead() }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [convo.messages])

  const send = () => {
    if (!msg.trim()) return
    const newMsg: Message = { id: Date.now(), text: msg, from: 'me', time: { k: 'now' }, read: true }
    onSendMessage(newMsg)
    setMsg('')
  }

  const toggleTranslation = (id: number) => {
    setTranslatedIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }

  const handleAI = (type: 'tone' | 'cultural') => {
    if (type === 'cultural') {
      const tip = CULTURAL_BY_COUNTRY[convo.country]?.[lang] ?? AI_CULTURAL[lang]
      setCulturalTip(tip)
      return
    }
    if (!msg.trim()) { setAiHint(t('typeFirstHint')); setTimeout(() => setAiHint(''), 2500); return }
    setAiProcessing(true)
    setTimeout(() => {
      setMsg(processAITone(msg, lang))
      setAiProcessing(false)
    }, 1000)
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${C.border}`, background: C.bg, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: C.text, padding: 4 }}>‹</button>
        <Avatar initials={convo.avatar} color={convo.color} size={38} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{convo.name}</div>
          <div style={{ fontSize: 12, color: C.sub }}>{convo.flag} {convo.country} · {t('activeNow')}</div>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="4" r="1.5" fill={C.sub} /><circle cx="10" cy="10" r="1.5" fill={C.sub} /><circle cx="10" cy="16" r="1.5" fill={C.sub} /></svg>
        </button>
      </div>
      <div ref={scrollRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 4, background: C.bg }}>
        {convo.messages.map(m => {
          const isMe = m.from === 'me'
          const isTranslated = !isMe && translatedIds.has(m.id)
          const displayText = isMe ? (m.translations?.[lang] ?? m.text) : isTranslated ? (m.translations?.[lang] ?? m.text) : m.text
          const hasThemTranslation = !isMe && !!m.translations
          return (
            <div key={m.id} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '78%' }}>
                  <div style={{ padding: '11px 14px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: isMe ? C.primary : C.surface, color: isMe ? '#fff' : C.text, fontSize: 14, lineHeight: 1.5 }}>{displayText}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 3, textAlign: isMe ? 'right' : 'left', padding: '0 4px' }}>{fmtTime(m.time, lang)}</div>
                </div>
              </div>
              {isMe && showAutoTranslateBadge && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 4, marginTop: 1 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: C.muted, fontWeight: 500 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 2h4M3 1v1M1 2c.5 1.5 2 3 3 3.5M5 2c-.3.8-1 1.8-2 2.8" stroke={C.muted} strokeWidth="1.1" strokeLinecap="round" /><path d="M5.5 6l1-2.5L8 6M6 5.3h1.5" stroke={C.muted} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {t('autoTranslated')}
                  </span>
                </div>
              )}
              {hasThemTranslation && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: 4, marginTop: 2 }}>
                  <button onClick={() => toggleTranslation(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 100, background: isTranslated ? C.primaryLight : C.surface2, border: `1px solid ${isTranslated ? C.primary : C.border}`, color: isTranslated ? C.primary : C.sub, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 2h4M3 1v1M1 2c.5 1.5 2 3 3 3.5M5 2c-.3.8-1 1.8-2 2.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /><path d="M5.5 6l1-2.5L8 6M6 5.3h1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {isTranslated ? t('originalBtn') : t('translateBtn')}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {culturalTip && (
        <div style={{ margin: '0 12px 0', borderTop: `1px solid ${C.border}`, background: C.surface, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>🏮</span>
          <div style={{ flex: 1, fontSize: 13, color: C.text, lineHeight: 1.5 }}>{culturalTip.replace(/^🏮\s*/, '')}</div>
          <button onClick={() => setCulturalTip(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, fontSize: 16, padding: 0, lineHeight: 1, flexShrink: 0 }}>×</button>
        </div>
      )}
      <div style={{ padding: '8px 12px', borderTop: `1px solid ${C.border}`, background: C.bg, flexShrink: 0 }}>
        {aiHint && <div style={{ fontSize: 12, color: C.error, marginBottom: 6, paddingLeft: 4 }}>{aiHint}</div>}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {([{ key: 'tone' as const, labelKey: 'improveTone', icon: '✨' }, { key: 'cultural' as const, labelKey: 'culturalTips', icon: '🏮' }]).map(a => (
            <button key={a.key} onClick={() => handleAI(a.key)} disabled={aiProcessing && a.key === 'tone'} style={{ padding: '7px 12px', borderRadius: 10, whiteSpace: 'nowrap', background: aiProcessing && a.key === 'tone' ? C.surface2 : C.primaryLight, border: `1px solid rgba(59,130,246,0.2)`, color: aiProcessing && a.key === 'tone' ? C.muted : C.primary, fontSize: 12, fontWeight: 600, cursor: aiProcessing && a.key === 'tone' ? 'not-allowed' : 'pointer', fontFamily: 'var(--font)', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <span>{a.icon}</span> {t(a.labelKey)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'center', background: C.bg, borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <button style={{ width: 36, height: 36, borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="6" r="3" stroke={C.sub} strokeWidth="1.5" /><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={C.sub} strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder={aiProcessing ? t('aiProcessing') : t('typeMessage')} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())} rows={msg.split('\n').length > 2 ? 3 : 1} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: `1.5px solid ${aiProcessing ? C.primary : C.border}`, background: aiProcessing ? C.primaryLight : C.surface, fontSize: 14, color: C.text, fontFamily: 'var(--font)', outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5 }} />
          {aiProcessing && <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 3 }}>{[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: C.primary, opacity: 0.6, animation: `pulse 1.2s ease-in-out ${i*0.4}s infinite` }} />)}</div>}
        </div>
        <button onClick={() => showToast(t('voiceRecording'))} style={{ width: 36, height: 36, borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none"><rect x="4" y="1" width="6" height="10" rx="3" stroke={C.sub} strokeWidth="1.5" /><path d="M1 9c0 3.3 2.7 6 6 6s6-2.7 6-6" stroke={C.sub} strokeWidth="1.5" strokeLinecap="round" /><line x1="7" y1="15" x2="7" y2="18" stroke={C.sub} strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
        <button onClick={send} disabled={aiProcessing} style={{ width: 36, height: 36, borderRadius: 10, background: msg && !aiProcessing ? C.primary : C.surface2, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8h14M9 2l6 6-6 6" stroke={msg && !aiProcessing ? '#fff' : C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  )
}

// ─── Meeting Time Recommendation ──────────────────────────────────────────────
type MeetingStep = 'selectPartner' | 'selectMy' | 'loading' | 'result'

function MeetingTimeFeature({ lang }: { lang: Lang }) {
  const t = (k: string) => i18n(lang, k)
  const [step, setStep] = useState<MeetingStep>('selectPartner')
  const [partner, setPartner] = useState<MeetingCountry | null>(null)
  const [mine, setMine] = useState<MeetingCountry | null>(null)
  const [result, setResult] = useState<{ h1: number; h2: number; overlap: boolean } | null>(null)

  const startAnalysis = (myC: MeetingCountry) => {
    setMine(myC)
    setStep('loading')
    setTimeout(() => {
      if (partner) setResult(findBestMeetingTime(partner, myC))
      setStep('result')
    }, 2200)
  }

  const reset = () => { setStep('selectPartner'); setPartner(null); setMine(null); setResult(null) }

  if (step === 'selectPartner' || step === 'selectMy') {
    const isPartner = step === 'selectPartner'
    return (
      <div style={{ marginTop: 20 }}>
        <div style={{ padding: '16px', borderRadius: 18, border: `1px solid ${C.border}`, background: C.bg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🕐</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{t('meetingTimeTitle')}</div>
              <div style={{ fontSize: 12, color: C.sub }}>{t('meetingTimeSub')}</div>
            </div>
          </div>
          {partner && !isPartner && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, background: C.primaryLight, border: `1px solid ${C.primary}`, marginBottom: 12 }}>
              <span style={{ fontSize: 20, color: C.text }}>{partner.flag}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{partner.name} ({partner.abbr})</span>
              <svg style={{ marginLeft: 'auto' }} width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke={C.primary} strokeWidth="1.5" strokeLinecap="round" /></svg>
            </div>
          )}
          <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 10 }}>
            {isPartner ? t('selectPartnerCountry') : t('selectMyCountry')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 260, overflowY: 'auto' }}>
            {MEETING_COUNTRIES.map(mc => (
              <button key={mc.name} onClick={() => { if (isPartner) { setPartner(mc); setStep('selectMy') } else { startAnalysis(mc) } }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface, cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: 22, color: C.text }}>{mc.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{mc.name}</div>
                  <div style={{ fontSize: 12, color: C.sub }}>{mc.abbr} (UTC{mc.offset >= 0 ? '+' : ''}{mc.offset})</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            ))}
          </div>
          {step === 'selectMy' && (
            <button onClick={() => setStep('selectPartner')} style={{ marginTop: 12, width: '100%', padding: '10px', borderRadius: 12, background: C.surface, border: `1px solid ${C.border}`, color: C.sub, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font)' }}>← {t('back')}</button>
          )}
        </div>
      </div>
    )
  }

  if (step === 'loading') {
    return (
      <div style={{ marginTop: 20 }}>
        <div style={{ padding: '40px 24px', borderRadius: 18, border: `1px solid ${C.border}`, background: C.bg, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🌍</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.primary, marginBottom: 20 }}>{t('analyzingTimezones')}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: C.primary, opacity: 0.3, animation: `pulse 1.2s ease-in-out ${i * 0.4}s infinite` }} />
            ))}
          </div>
          <div style={{ height: 4, background: C.border, borderRadius: 100, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: C.primary, borderRadius: 100, width: '70%', transition: 'width 2s ease' }} />
          </div>
        </div>
      </div>
    )
  }

  if (step === 'result' && result && partner && mine) {
    return (
      <div className="anim-fade" style={{ marginTop: 20 }}>
        <div style={{ padding: '20px', borderRadius: 18, border: `2px solid ${C.primary}`, background: C.bg }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>{t('bestMeetingTime')}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, color: C.text }}>{partner.flag}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginTop: 4 }}>{partner.name}</div>
            </div>
            <div style={{ fontSize: 24, color: C.muted }}>⇄</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, color: C.text }}>{mine.flag}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginTop: 4 }}>{mine.name}</div>
            </div>
          </div>
          <div style={{ background: C.primaryLight, borderRadius: 16, padding: '16px', marginBottom: 16, border: `1px solid ${C.primary}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.primary, marginBottom: 12, textAlign: 'center' }}>{t('recommendedTime')}</div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{fmtHour(result.h1)}</div>
                <div style={{ fontSize: 12, color: C.text, fontWeight: 600, marginTop: 2 }}>{partner.abbr}</div>
                <div style={{ fontSize: 11, color: C.sub }}>{partner.name}</div>
              </div>
              <div style={{ width: 1, background: C.border }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{fmtHour(result.h2)}</div>
                <div style={{ fontSize: 12, color: C.text, fontWeight: 600, marginTop: 2 }}>{mine.abbr}</div>
                <div style={{ fontSize: 11, color: C.sub }}>{mine.name}</div>
              </div>
            </div>
          </div>
          <div style={{ background: C.surface, borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 4 }}>{t('meetingReason')}</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{t(result.overlap ? 'meetingReasonOverlap' : 'meetingReasonCompromise')}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn label={t('confirm')} onClick={reset} />
            <Btn label={t('back')} onClick={reset} variant="ghost" />
          </div>
        </div>
      </div>
    )
  }

  return null
}

// ─── Meeting Summary ──────────────────────────────────────────────────────────
interface MeetingSummary {
  overview: string
  points: string[]
  decisions: string[]
  actions: string[]
  followUp: string
}

interface MeetingSummaryApiResponse {
  meeting_summary?: {
    agreed?: unknown
    disputed_or_pending?: unknown
  }
  todo_list?: unknown
  [key: string]: unknown
}

const MEETING_SUMMARY_API_URL =
  (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_MEETING_SUMMARY_API_URL
  ?? '/api/meeting-summary'

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value
    .map(item => {
      if (typeof item === 'string') return item.trim()
      if (item && typeof item === 'object') {
        const obj = item as Record<string, unknown>
        const text = obj.task ?? obj.title ?? obj.summary ?? obj.description ?? obj.text
        return typeof text === 'string' ? text.trim() : ''
      }
      return ''
    })
    .filter(Boolean)
}

const toActionArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value
    .map(item => {
      if (typeof item === 'string') return item.trim()
      if (!item || typeof item !== 'object') return ''
      const obj = item as Record<string, unknown>
      const task = typeof obj.task === 'string' ? obj.task.trim() : ''
      const assignee = typeof obj.assignee === 'string' ? obj.assignee.trim() : ''
      const dueDate = typeof obj.due_date === 'string' ? obj.due_date.trim() : ''
      if (!task) return ''
      const owner = assignee ? ` [${assignee}]` : ''
      const due = dueDate ? ` — ${dueDate}` : ''
      return `${task}${owner}${due}`
    })
    .filter(Boolean)
}

const normalizeMeetingSummary = (data: MeetingSummaryApiResponse, fileName: string): MeetingSummary => {
  const meetingSummary = data.meeting_summary ?? {}
  const agreed = toStringArray(meetingSummary.agreed)
  const pending = toStringArray(meetingSummary.disputed_or_pending)
  const actions = toActionArray(data.todo_list)

  const overview = [
    fileName,
    `${agreed.length + pending.length} discussion item${agreed.length + pending.length === 1 ? '' : 's'}`,
    `${actions.length} action item${actions.length === 1 ? '' : 's'}`,
  ].join(' · ')

  return {
    overview,
    points: [...agreed, ...pending],
    decisions: agreed,
    actions,
    followUp: pending.length > 0
      ? pending.join(' ')
      : actions.length > 0
        ? 'Follow-up is required for the action items listed above.'
        : 'No additional follow-up items were returned by the backend.',
  }
}

// ─── Meetings Tab ─────────────────────────────────────────────────────────────
const COLLAB_SITUATIONS: { key: string; labelEn: string; icon: string }[] = [
  { key: 'business_meeting', labelEn: 'Business Meeting', icon: '🤝' },
  { key: 'project_collab', labelEn: 'Project Collaboration', icon: '💼' },
  { key: 'contract_negotiation', labelEn: 'Contract / Negotiation', icon: '📝' },
  { key: 'business_trip', labelEn: 'Business Trip', icon: '✈️' },
  { key: 'other', labelEn: 'Other', icon: '💬' },
]
const COLLAB_LABELS: Record<Lang, string[]> = {
  en: ['Business Meeting', 'Project Collaboration', 'Contract / Negotiation', 'Business Trip', 'Other'],
  ko: ['비즈니스 회의', '프로젝트 협업', '계약 / 협상', '출장', '기타'],
  ja: ['ビジネス会議', 'プロジェクト協業', '契約 / 交渉', '出張', 'その他'],
  zh: ['商务会议', '项目合作', '合同/谈判', '商务出行', '其他'],
  pt: ['Reunião de Negócios', 'Colaboração em Projeto', 'Contrato / Negociação', 'Viagem de Negócios', 'Outro'],
  es: ['Reunión de Negocios', 'Colaboración en Proyecto', 'Contrato / Negociación', 'Viaje de Negocios', 'Otro'],
}

// ─── Meetings Tab ─────────────────────────────────────────────────────────────
interface SavedMeeting {
  id: number
  title: string
  date: string
  fileName: string
  preview: string
  participants: string[]
  keyPoints: string[]
  decisions: string[]
  actions: string[]
  overview: string
}

const SAMPLE_MEETINGS: SavedMeeting[] = [
  {
    id: 1,
    title: 'Q3 Partnership Review',
    date: '2026-08-14',
    fileName: 'q3_partnership_review.pdf',
    preview: 'Reviewed Q3 performance metrics showing 23% growth. Discussed Southeast Asia expansion and partnership renewal.',
    participants: ['Alex Kim (CBO)', 'Sarah Chen (Strategy)', 'Michael Torres (Legal)'],
    keyPoints: ['Q3 revenue showed 23% year-over-year growth across all markets', 'Southeast Asia expansion targeted for Q1 2027 launch', 'Partnership agreement approaching renewal — terms under renegotiation', 'Technical integration roadmap presented with 6-month estimated timeline'],
    decisions: ['Extend partnership agreement by 2 years with revised terms', 'Approve $2.4M budget for market expansion initiative', 'Select Singapore as the first Southeast Asian hub location'],
    actions: ['Alex: Draft updated partnership contract by Aug 20', 'Finance: Submit budget allocation request to board by Aug 15', 'Marketing: Develop Southeast Asia market entry strategy by Sep 1'],
    overview: '47-minute strategic review meeting covering Q3 performance, Southeast Asia market expansion plans, and partnership agreement renewal negotiation.',
  },
  {
    id: 2,
    title: 'Product Integration Sprint Planning',
    date: '2026-08-10',
    fileName: 'sprint_planning_aug10.docx',
    preview: 'Planned integration sprint for API alignment and dashboard localization across three regional teams.',
    participants: ['Ji-ho Park (Engineering Lead)', 'Emma Wilson (Product)', 'Carlos Mendez (QA)', 'Yuki Tanaka (Localization)'],
    keyPoints: ['API integration requires 6-week development timeline', 'Dashboard must fully support Korean, Japanese, and Portuguese locales', 'QA sign-off required before regional launch', 'Feature freeze date set two weeks before launch'],
    decisions: ['Sprint start date: August 18', 'Bi-weekly syncs every Monday and Thursday at 9 AM UTC', 'Regional QA leads assigned per market: APAC, LATAM, EMEA'],
    actions: ['Dev: Complete API spec documentation by Aug 16', 'Design: Finalize localized UI mockups by Aug 19', 'QA: Prepare regional test case suite by Aug 21', 'Yuki: Deliver all translation strings by Aug 23'],
    overview: '55-minute cross-regional sprint planning session aligning four teams on the upcoming product integration milestone and localization requirements.',
  },
]

interface MeetingInfo {
  myName: string
  myCompany: string
  myCountry: typeof MEETING_COUNTRIES[number] | null
  partnerName: string
  partnerCompany: string
  partnerCountry: typeof MEETING_COUNTRIES[number] | null
  collabSituation: string | null
}

function MeetingsTab({ lang, profile }: { lang: Lang; profile: UserProfile }) {
  const t = (k: string) => i18n(lang, k)
  const L = lang

  const [info, setInfo] = useState<MeetingInfo>({
    myName: profile.name || '',
    myCompany: profile.company || '',
    myCountry: MEETING_COUNTRIES.find(c => c.name === profile.country) ?? null,
    partnerName: '', partnerCompany: '', partnerCountry: null, collabSituation: null,
  })
  const [editing, setEditing] = useState(false)
  const [draftMyName, setDraftMyName] = useState('')
  const [draftMyCompany, setDraftMyCompany] = useState('')
  const [draftMyCountry, setDraftMyCountry] = useState<typeof MEETING_COUNTRIES[number] | null>(null)
  const [draftPartnerName, setDraftPartnerName] = useState('')
  const [draftPartnerCompany, setDraftPartnerCompany] = useState('')
  const [draftPartnerCountry, setDraftPartnerCountry] = useState<typeof MEETING_COUNTRIES[number] | null>(null)
  const [draftCollab, setDraftCollab] = useState<string | null>(null)
  const [showMyCountryPicker, setShowMyCountryPicker] = useState(false)
  const [showPartnerCountryPicker, setShowPartnerCountryPicker] = useState(false)

  type MView = 'home' | 'list' | 'upload' | 'summary' | 'detail'
  const [meetingView, setMeetingView] = useState<MView>('home')
  const [savedMeetings, setSavedMeetings] = useState<SavedMeeting[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [summary, setSummary] = useState<MeetingSummary | null>(null)
  const [selectedSaved, setSelectedSaved] = useState<SavedMeeting | null>(null)
  const [saveConfirm, setSaveConfirm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const collabLabels = COLLAB_LABELS[lang]
  const activeCollab = info.collabSituation ? COLLAB_SITUATIONS.find(s => s.key === info.collabSituation) : null
  const activeCollabLabel = activeCollab ? collabLabels[COLLAB_SITUATIONS.indexOf(activeCollab)] : null

  const openEdit = () => {
    setDraftMyName(info.myName); setDraftMyCompany(info.myCompany)
    setDraftMyCountry(info.myCountry); setDraftPartnerName(info.partnerName)
    setDraftPartnerCompany(info.partnerCompany); setDraftPartnerCountry(info.partnerCountry)
    setDraftCollab(info.collabSituation); setEditing(true)
  }
  const saveEdit = () => {
    setInfo({ myName: draftMyName, myCompany: draftMyCompany, myCountry: draftMyCountry, partnerName: draftPartnerName, partnerCompany: draftPartnerCompany, partnerCountry: draftPartnerCountry, collabSituation: draftCollab })
    setEditing(false)
  }

  const handleFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.txt')) {
      setUploadError('TXT 파일만 업로드할 수 있습니다.')
      setUploadedFile(null)
      return
    }
    setUploadError('')
    setUploadedFile(file)
    setSummary(null)
    setSaveConfirm(false)
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (file) handleFileSelect(file); e.target.value = ''
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files?.[0]; if (file) handleFileSelect(file)
  }
  const handleCreateSummary = async () => {
    if (!uploadedFile) {
      setUploadError('회의 파일을 먼저 선택해주세요.')
      return
    }

    setProcessing(true)
    setUploadError('')
    setSummary(null)

    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)
      formData.append('lang', lang)

      const response = await fetch(MEETING_SUMMARY_API_URL, {
        method: 'POST',
        body: formData,
      })

      const rawText = await response.text()
      let data: MeetingSummaryApiResponse

      try {
        data = rawText ? JSON.parse(rawText) as MeetingSummaryApiResponse : {}
      } catch {
        throw new Error('백엔드가 올바른 JSON 응답을 반환하지 않았습니다.')
      }

      if (!response.ok) {
        const message = typeof data.detail === 'string'
          ? data.detail
          : typeof data.message === 'string'
            ? data.message
            : `회의 요약 API 요청에 실패했습니다. (${response.status})`
        throw new Error(message)
      }

      const normalized = normalizeMeetingSummary(data, uploadedFile.name)

      if (normalized.points.length === 0 && normalized.actions.length === 0) {
        throw new Error('백엔드 응답에 회의 요약 데이터가 없습니다.')
      }

      setSummary(normalized)
      setMeetingView('summary')
    } catch (error) {
      const message = error instanceof Error ? error.message : '회의 요약 생성 중 오류가 발생했습니다.'
      setUploadError(message)
    } finally {
      setProcessing(false)
    }
  }
  const handleSaveMeeting = () => {
    if (!summary) return
    const rawTitle = uploadedFile?.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') || 'Meeting Summary'
    const newMeeting: SavedMeeting = {
      id: Date.now(),
      title: rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1),
      date: new Date().toISOString().slice(0, 10),
      fileName: uploadedFile?.name || 'meeting.txt',
      preview: summary.overview,
      participants: ['Alex Kim', 'Sarah Chen', 'Michael Torres'],
      keyPoints: summary.points,
      decisions: summary.decisions,
      actions: summary.actions,
      overview: summary.overview,
    }
    setSavedMeetings(prev => [newMeeting, ...prev])
    setSaveConfirm(true)
    setTimeout(() => { setMeetingView('list'); setUploadedFile(null); setSummary(null); setSaveConfirm(false) }, 1800)
  }

  const lbl = (ko: string, ja: string, zh: string, pt: string, es: string, en: string) =>
    L === 'ko' ? ko : L === 'ja' ? ja : L === 'zh' ? zh : L === 'pt' ? pt : L === 'es' ? es : en

  // ── Edit screen ──────────────────────────────────────────────────────────────
  if (editing) {
    return (
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', background: C.bg }}>
        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <button onClick={() => setEditing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: C.text, padding: 2, lineHeight: 1 }}>{'‹'}</button>
          <span style={{ fontSize: 17, fontWeight: 700, color: C.text }}>{lbl('정보 변경', '情報変更', '修改信息', 'Alterar Informações', 'Cambiar Información', 'Edit Information')}</span>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 20px 32px' }}>
          <EditSection title={lbl('내 정보', '自分の情報', '我的信息', 'Minhas Informações', 'Mi Información', 'My Information')} emoji="👤">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <EditField label={lbl('이름', '名前', '姓名', 'Nome', 'Nombre', 'Name')}
                placeholder={lbl('이름 입력', '名前を入力', '输入姓名', 'Digite o nome', 'Ingrese el nombre', 'Enter name')}
                value={draftMyName} onChange={setDraftMyName} />
              <EditField label={lbl('회사명', '会社名', '公司名', 'Empresa', 'Empresa', 'Company')}
                placeholder={lbl('회사명 입력', '会社名を入力', '输入公司名', 'Digite a empresa', 'Ingrese la empresa', 'Enter company')}
                value={draftMyCompany} onChange={setDraftMyCompany} />
            </div>
          </EditSection>
          <EditSection title={lbl('내 국가', '自国', '我的国家', 'Meu País', 'Mi País', 'My Country')} emoji="🌍">
            <button onClick={() => setShowMyCountryPicker(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 14px', borderRadius: 12, border: `1.5px solid ${draftMyCountry ? C.primary : C.border}`, background: draftMyCountry ? C.primaryLight : C.surface, cursor: 'pointer', fontFamily: 'var(--font)', textAlign: 'left', boxSizing: 'border-box' }}>
              <span style={{ fontSize: 20 }}>{draftMyCountry ? draftMyCountry.flag : '🌐'}</span>
              <span style={{ flex: 1, fontSize: 14, color: draftMyCountry ? C.primary : C.muted, fontWeight: draftMyCountry ? 600 : 400 }}>
                {draftMyCountry ? draftMyCountry.name : lbl('국가 선택', '国を選択', '选择国家', 'Selecionar país', 'Seleccionar país', 'Select country')}
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 5.5l3.5 3.5 3.5-3.5" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </EditSection>
          <EditSection title={lbl('파트너 정보', 'パートナー情報', '合作伙伴信息', 'Informações do Parceiro', 'Información del Socio', 'Partner Information')} emoji="🤝">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <EditField label={lbl('파트너 이름', 'パートナー名', '合作伙伴姓名', 'Nome do Parceiro', 'Nombre del Socio', 'Partner Name')}
                placeholder={lbl('이름 입력', '名前を入力', '输入姓名', 'Digite o nome', 'Ingrese el nombre', 'Enter name')}
                value={draftPartnerName} onChange={setDraftPartnerName} />
              <EditField label={lbl('파트너 회사명', '会社名', '合作伙伴公司', 'Empresa Parceira', 'Empresa Socia', 'Partner Company')}
                placeholder={lbl('회사명 입력', '会社名を入力', '输入公司名', 'Digite a empresa', 'Ingrese la empresa', 'Enter company')}
                value={draftPartnerCompany} onChange={setDraftPartnerCompany} />
            </div>
          </EditSection>
          <EditSection title={lbl('파트너 국가', 'パートナーの国', '合作伙伴国家', 'País do Parceiro', 'País del Socio', 'Partner Country')} emoji="🌐">
            <button onClick={() => setShowPartnerCountryPicker(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 14px', borderRadius: 12, border: `1.5px solid ${draftPartnerCountry ? C.primary : C.border}`, background: draftPartnerCountry ? C.primaryLight : C.surface, cursor: 'pointer', fontFamily: 'var(--font)', textAlign: 'left', boxSizing: 'border-box' }}>
              <span style={{ fontSize: 20 }}>{draftPartnerCountry ? draftPartnerCountry.flag : '🌐'}</span>
              <span style={{ flex: 1, fontSize: 14, color: draftPartnerCountry ? C.primary : C.muted, fontWeight: draftPartnerCountry ? 600 : 400 }}>
                {draftPartnerCountry ? draftPartnerCountry.name : lbl('국가 선택', '国を選択', '选择国家', 'Selecionar país', 'Seleccionar país', 'Select country')}
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 5.5l3.5 3.5 3.5-3.5" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </EditSection>
          <EditSection title={lbl('협업 상황 선택', '協業状況を選択', '选择协作情况', 'Situação de Colaboração', 'Situación de Colaboración', 'Collaboration Situation')} emoji="📋">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {COLLAB_SITUATIONS.map((s, i) => {
                const active = draftCollab === s.key
                return (
                  <button key={s.key} onClick={() => setDraftCollab(active ? null : s.key)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${active ? C.primary : C.border}`, background: active ? C.primaryLight : C.surface, cursor: 'pointer', fontFamily: 'var(--font)', textAlign: 'left' }}>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: active ? 700 : 400, color: active ? C.primary : C.text }}>{collabLabels[i]}</span>
                    {active && <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" fill={C.primary} /><path d="M5 9l2.5 2.5L13 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </button>
                )
              })}
            </div>
          </EditSection>
          <Btn label={lbl('저장', '保存', '保存', 'Salvar', 'Guardar', 'Save')} onClick={saveEdit} />
        </div>
        {showMyCountryPicker && (
          <div style={{ position: 'absolute', inset: 0, background: CV.overlay, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', zIndex: 300 }} onClick={() => setShowMyCountryPicker(false)}>
            <div className="anim-up" onClick={e => e.stopPropagation()} style={{ background: C.bg, borderRadius: '24px 24px 0 0', width: '100%', maxHeight: '75%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '12px 20px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                <div style={{ width: 36, height: 4, background: C.border, borderRadius: 100, margin: '4px auto 12px' }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{lbl('내 국가 선택', '自国を選択', '选择我的国家', 'Selecionar Meu País', 'Seleccionar Mi País', 'Select My Country')}</div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {MEETING_COUNTRIES.map(c => (
                  <button key={c.name} onClick={() => { setDraftMyCountry(c); setShowMyCountryPicker(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${draftMyCountry?.name === c.name ? C.primary : C.border}`, background: draftMyCountry?.name === c.name ? C.primaryLight : C.surface, cursor: 'pointer', fontFamily: 'var(--font)', textAlign: 'left' }}>
                    <span style={{ fontSize: 22 }}>{c.flag}</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: C.text }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: C.muted }}>{c.abbr}</span>
                    {draftMyCountry?.name === c.name && <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" fill={C.primary} /><path d="M5 9l2.5 2.5L13 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {showPartnerCountryPicker && (
          <div style={{ position: 'absolute', inset: 0, background: CV.overlay, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', zIndex: 300 }} onClick={() => setShowPartnerCountryPicker(false)}>
            <div className="anim-up" onClick={e => e.stopPropagation()} style={{ background: C.bg, borderRadius: '24px 24px 0 0', width: '100%', maxHeight: '75%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '12px 20px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                <div style={{ width: 36, height: 4, background: C.border, borderRadius: 100, margin: '4px auto 12px' }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{lbl('파트너 국가 선택', 'パートナーの国を選択', '选择合作伙伴国家', 'Selecionar País do Parceiro', 'Seleccionar País del Socio', 'Select Partner Country')}</div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {MEETING_COUNTRIES.map(c => (
                  <button key={c.name} onClick={() => { setDraftPartnerCountry(c); setShowPartnerCountryPicker(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${draftPartnerCountry?.name === c.name ? C.primary : C.border}`, background: draftPartnerCountry?.name === c.name ? C.primaryLight : C.surface, cursor: 'pointer', fontFamily: 'var(--font)', textAlign: 'left' }}>
                    <span style={{ fontSize: 22 }}>{c.flag}</span>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: C.text }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: C.muted }}>{c.abbr}</span>
                    {draftPartnerCountry?.name === c.name && <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" fill={C.primary} /><path d="M5 9l2.5 2.5L13 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Saved meeting detail ─────────────────────────────────────────────────────
  if (meetingView === 'detail' && selectedSaved) {
    return (
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: C.bg }}>
        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <button onClick={() => setMeetingView('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: C.text, padding: 2, lineHeight: 1 }}>{'‹'}</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedSaved.title}</div>
            <div style={{ fontSize: 11, color: C.sub }}>{selectedSaved.date} {'·'} {selectedSaved.fileName}</div>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 20px 32px' }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              {'👥'} {lbl('참가자', '参加者', '参与者', 'Participantes', 'Participantes', 'Participants')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedSaved.participants.map((p, i) => (
                <span key={i} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 100, background: C.primaryLight, color: C.primary, fontWeight: 600 }}>{p}</span>
              ))}
            </div>
          </div>
          <div style={{ padding: '14px', borderRadius: 14, background: C.primaryLight, border: `1px solid ${C.primary}`, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{t('meetingOverview')}</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{selectedSaved.overview}</div>
          </div>
          <SummarySection icon={'💬'} title={t('keyDiscussion')} items={selectedSaved.keyPoints} />
          <SummarySection icon={'✅'} title={t('importantDecisions')} items={selectedSaved.decisions} accent />
          <SummarySection icon={'📌'} title={t('actionItems')} items={selectedSaved.actions} />
        </div>
      </div>
    )
  }

  // ── Generated summary ────────────────────────────────────────────────────────
  if (meetingView === 'summary' && summary) {
    return (
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: C.bg }}>
        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <button onClick={() => { setMeetingView('upload'); setSummary(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: C.text, padding: 2, lineHeight: 1 }}>{'‹'}</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{t('meetingSummaryTitle')}</div>
            <div style={{ fontSize: 11, color: C.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{uploadedFile?.name}</div>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 20px 32px' }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              {'👥'} {lbl('참가자', '参加者', '参与者', 'Participantes', 'Participantes', 'Participants')}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Alex Kim', 'Sarah Chen', 'Michael Torres'].map((p, i) => (
                <span key={i} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 100, background: C.primaryLight, color: C.primary, fontWeight: 600 }}>{p}</span>
              ))}
            </div>
          </div>
          <div style={{ padding: '14px', borderRadius: 14, background: C.primaryLight, border: `1px solid ${C.primary}`, marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{t('meetingOverview')}</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{summary.overview}</div>
          </div>
          <SummarySection icon={'💬'} title={t('keyDiscussion')} items={summary.points} />
          <SummarySection icon={'✅'} title={t('importantDecisions')} items={summary.decisions} accent />
          <SummarySection icon={'📌'} title={t('actionItems')} items={summary.actions} />
          <div style={{ padding: '14px', borderRadius: 14, background: CV.yellowTint, border: `1px solid ${C.border}`, marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.warning, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{'⚡'} {t('followUpInfo')}</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{summary.followUp}</div>
          </div>
          {!saveConfirm ? (
            <button onClick={handleSaveMeeting}
              style={{ width: '100%', padding: '16px', borderRadius: 16, background: C.primary, border: 'none', color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'var(--font)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M15 2H5a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M7 2v5h6V2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 12h8M6 15h5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              {lbl('회의 저장', '会議を保存', '保存会议', 'Salvar Reunião', 'Guardar Reunión', 'Save Meeting')}
            </button>
          ) : (
            <div className="anim-fade" style={{ padding: '16px', borderRadius: 16, background: CV.successBg, border: `1px solid ${CV.successBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill={C.success} /><path d="M6 10l2.5 2.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.success }}>{lbl('회의가 저장되었습니다.', '会議を保存しました。', '会议已保存。', 'Reunião salva.', 'Reunión guardada.', 'Meeting saved.')}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Upload view ──────────────────────────────────────────────────────────────
  if (meetingView === 'upload') {
    return (
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: C.bg }}>
        <input ref={fileInputRef} type="file" accept=".txt" style={{ display: 'none' }} onChange={handleFileChange} />
        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <button onClick={() => setMeetingView('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: C.text, padding: 2, lineHeight: 1 }}>{'‹'}</button>
          <span style={{ fontSize: 17, fontWeight: 700, color: C.text }}>
            {'📁'} {lbl('새 회의 요약', '新しい会議サマリー', '新建会议摘要', 'Nova Reunião', 'Nueva Reunión', 'New Meeting Summary')}
          </span>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 20px 32px' }}>
          {/* Drag & drop zone */}
          <div
            onDragEnter={e => { e.preventDefault(); setIsDragging(true) }}
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={e => { e.preventDefault(); setIsDragging(false) }}
            onDrop={handleDrop}
            onClick={() => !uploadedFile && fileInputRef.current?.click()}
            style={{ borderRadius: 18, border: `2px dashed ${isDragging ? C.primary : uploadedFile ? CV.successBorder : C.border}`, background: isDragging ? C.primaryLight : uploadedFile ? CV.successBg : C.surface, padding: '36px 24px', textAlign: 'center', cursor: uploadedFile ? 'default' : 'pointer', transition: 'border-color 0.15s, background 0.15s', marginBottom: 14 }}>
            {!uploadedFile ? (
              <>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: isDragging ? C.primary : C.primaryLight, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 4v16M14 4l-6 6M14 4l6 6" stroke={isDragging ? '#fff' : C.primary} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 22v2a2 2 0 002 2h18a2 2 0 002-2v-2" stroke={isDragging ? '#fff' : C.primary} strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: isDragging ? C.primary : C.text, marginBottom: 6 }}>
                  {isDragging
                    ? lbl('여기에 놓아주세요', 'ここにドロップ', '拖放到此处', 'Solte aqui', 'Suéltelo aquí', 'Drop it here')
                    : lbl('회의 파일 업로드', '会議ファイルをアップロード', '上传会议文件', 'Upload de arquivo de reunião', 'Subir archivo de reunión', 'Upload meeting file')}
                </div>
                <div style={{ fontSize: 13, color: C.sub }}>
                  {lbl('파일을 끌어서 놓거나 클릭하여 선택', 'ドラッグ＆ドロップまたはクリック', '拖放文件或点击选择', 'Arraste ou clique para selecionar', 'Arrastre o haga clic', 'Drag & drop your file here or click to upload')}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left' }}>
                <div style={{ width: 52, height: 52, borderRadius: 13, background: CV.successBg, border: `1px solid ${CV.successBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{'📄'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{uploadedFile.name}</div>
                  <div style={{ fontSize: 12, color: C.sub, marginTop: 3 }}>
                    {(uploadedFile.size / 1024).toFixed(1)} KB {'·'} {lbl('업로드 완료', 'アップロード完了', '上传完成', 'Upload concluído', 'Carga completada', 'Ready to process')}
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); setUploadedFile(null); setUploadError('') }}
                  style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.muted, fontSize: 18, flexShrink: 0 }}>{'×'}</button>
              </div>
            )}
          </div>

          {/* File type error */}
          {uploadError && (
            <div style={{ padding: '10px 14px', borderRadius: 10, background: CV.redTint, border: `1px solid ${CV.redBorder}`, marginBottom: 12, fontSize: 13, color: C.error, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⚠️</span> {uploadError}
            </div>
          )}

          {/* Choose another file link */}
          {uploadedFile && (
            <button onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%', padding: '10px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, cursor: 'pointer', fontSize: 13, color: C.sub, fontFamily: 'var(--font)', marginBottom: 14 }}>
              {lbl('다른 파일 선택', '別のファイルを選択', '选择其他文件', 'Selecionar outro arquivo', 'Seleccionar otro archivo', 'Choose a different file')}
            </button>
          )}

          {/* Create summary button */}
          {uploadedFile && !processing && (
            <button onClick={handleCreateSummary}
              style={{ width: '100%', padding: '15px', borderRadius: 14, background: C.primary, border: 'none', color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="white" strokeWidth="1.5" /><path d="M5.5 8l2 2 3.5-3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {lbl('회의 요약 생성', '会議サマリーを作成', '创建会议摘要', 'Criar Resumo da Reunião', 'Crear Resumen de Reunión', 'Create Meeting Summary')}
            </button>
          )}

          {/* Processing state */}
          {processing && (
            <div style={{ padding: '18px 20px', borderRadius: 14, background: C.primaryLight, border: `1px solid ${C.primary}`, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', border: `3px solid ${C.primary}`, borderTopColor: 'transparent', flexShrink: 0, animation: 'spin 1s linear infinite' }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.primary }}>{lbl('회의 요약 생성 중...', '会議サマリー作成中...', '正在创建摘要...', 'Criando resumo...', 'Creando resumen...', 'Creating meeting summary...')}</div>
                <div style={{ fontSize: 12, color: C.sub, marginTop: 3 }}>{uploadedFile?.name}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Saved meetings list ──────────────────────────────────────────────────────
  if (meetingView === 'list') {
    return (
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: C.bg }}>
        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <button onClick={() => setMeetingView('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: C.text, padding: 2, lineHeight: 1 }}>{'‹'}</button>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: C.text }}>
              {'📋'} {lbl('저장된 회의', '保存された会議', '已保存的会议', 'Reuniões Salvas', 'Reuniones Guardadas', 'Saved Meetings')}
            </span>
          </div>
          {savedMeetings.length > 0 && (
            <span style={{ fontSize: 12, fontWeight: 700, color: C.primary, background: C.primaryLight, padding: '3px 10px', borderRadius: 100 }}>{savedMeetings.length}</span>
          )}
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 20px 32px' }}>
          {savedMeetings.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 260, gap: 12 }}>
              <div style={{ fontSize: 48 }}>{'📭'}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.muted, textAlign: 'center' }}>
                {'저장된 회의자료가 없습니다'}
              </div>
              <button onClick={() => setMeetingView('upload')}
                style={{ marginTop: 8, padding: '11px 22px', borderRadius: 12, background: C.primary, border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font)', cursor: 'pointer' }}>
                {lbl('파일 업로드하기', 'ファイルをアップロード', '上传文件', 'Carregar arquivo', 'Subir archivo', 'Upload a file')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {savedMeetings.map(m => (
                <button key={m.id} onClick={() => { setSelectedSaved(m); setMeetingView('detail') }}
                  style={{ display: 'block', width: '100%', padding: '16px', borderRadius: 16, background: C.surface, border: `1px solid ${C.border}`, cursor: 'pointer', fontFamily: 'var(--font)', textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{'📋'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</div>
                      <div style={{ fontSize: 11, color: C.sub, marginBottom: 6 }}>{m.date} {'·'} {m.fileName}</div>
                      <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{m.preview}</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 4 }}><path d="M6 4l4 4-4 4" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Home view (category selection) ───────────────────────────────────────────
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div style={{ padding: '16px 20px 32px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: '0 0 16px', letterSpacing: '-0.03em' }}>{t('meetingAI')}</h2>

          {/* Info Card */}
          <div style={{ borderRadius: 18, border: `1px solid ${C.border}`, background: C.surface, marginBottom: 20, position: 'relative' }}>
            <button onClick={openEdit} title="Edit information"
              style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, width: 28, height: 28, borderRadius: '50%', background: '#fff', border: 'none', boxShadow: '0 1px 4px rgba(26,15,1,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 16L4 20L8 19L19.5858 7.41421C20.3668 6.63316 20.3668 5.36683 19.5858 4.58579L19.4142 4.41421C18.6332 3.63316 17.3668 3.63317 16.5858 4.41421L5 16Z" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M15 6L18 9" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M13 20H21" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr' }}>
              <div style={{ padding: '14px 38px 12px 14px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 9 }}>
                  {'👤'} {lbl('내 정보', '自分', '我的', 'Meus dados', 'Mis datos', 'Me')}
                </div>
                <SummaryCell label={info.myName} placeholder={t('namePlaceholder')} />
                <SummaryCell label={info.myCompany} placeholder={t('companyPlaceholder')} />
                <SummaryCell label={info.myCountry ? `${info.myCountry.flag} ${info.myCountry.name}` : ''} placeholder={t('countryLabel')} />
              </div>
              <div style={{ background: C.border }} />
              <div style={{ padding: '14px 14px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 9 }}>
                  {'🤝'} {lbl('파트너', 'パートナー', '合作伙伴', 'Parceiro', 'Socio', 'Partner')}
                </div>
                <SummaryCell label={info.partnerName} placeholder={lbl('이름 미입력', '未入力', '未填写', 'Não informado', 'No ingresado', 'Not set')} />
                <SummaryCell label={info.partnerCompany} placeholder={lbl('회사 미입력', '未入力', '未填写', 'Não informado', 'No ingresado', 'Not set')} />
                <SummaryCell label={info.partnerCountry ? `${info.partnerCountry.flag} ${info.partnerCountry.name}` : ''} placeholder={lbl('국가 미선택', '未選択', '未选择', 'Não selecionado', 'No seleccionado', 'Not set')} />
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: C.sub, fontWeight: 600 }}>{lbl('협업 상황', '協業状況', '协作情况', 'Situação', 'Situación', 'Situation')}:</span>
              {activeCollab ? (
                <span style={{ fontSize: 11, fontWeight: 700, color: C.primary, background: C.primaryLight, padding: '3px 10px', borderRadius: 100 }}>
                  {activeCollab.icon} {activeCollabLabel}
                </span>
              ) : (
                <span style={{ fontSize: 11, color: C.muted }}>{lbl('미선택', '未選択', '未选择', 'Não selecionado', 'No seleccionado', 'Not selected')}</span>
              )}
            </div>
          </div>

          {/* Category cards */}
          <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 10 }}>
            {lbl('회의 관리', '会議管理', '会议管理', 'Gerenciar Reuniões', 'Gestión de Reuniones', 'Meeting Management')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Saved Meetings */}
            <button onClick={() => setMeetingView('list')}
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', borderRadius: 18, background: C.surface, border: `1px solid ${C.border}`, cursor: 'pointer', fontFamily: 'var(--font)', textAlign: 'left', width: '100%' }}>
              <div style={{ width: 52, height: 52, borderRadius: 15, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{'📋'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 3 }}>
                  {lbl('저장된 회의', '保存された会議', '已保存的会议', 'Reuniões Salvas', 'Reuniones Guardadas', 'Saved Meetings')}
                </div>
                <div style={{ fontSize: 13, color: C.sub }}>
                  {savedMeetings.length > 0
                    ? lbl(`${savedMeetings.length}개의 회의 저장됨`, `${savedMeetings.length}件の会議が保存済み`, `已保存 ${savedMeetings.length} 次会议`, `${savedMeetings.length} reunião(ões) salva(s)`, `${savedMeetings.length} reunión(es) guardada(s)`, `${savedMeetings.length} meeting${savedMeetings.length !== 1 ? 's' : ''} saved`)
                    : lbl('저장된 회의 없음', '保存済みなし', '暂无保存', 'Nenhuma salva', 'Ninguna guardada', 'No saved meetings')}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {savedMeetings.length > 0 && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.primary, background: C.primaryLight, padding: '3px 9px', borderRadius: 100 }}>{savedMeetings.length}</span>
                )}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 5l4 4-4 4" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" /></svg>
              </div>
            </button>

            {/* File Upload */}
            <button onClick={() => setMeetingView('upload')}
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', borderRadius: 18, background: C.surface, border: `1px solid ${C.border}`, cursor: 'pointer', fontFamily: 'var(--font)', textAlign: 'left', width: '100%' }}>
              <div style={{ width: 52, height: 52, borderRadius: 15, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{'📁'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 3 }}>
                  {lbl('파일 업로드', 'ファイルアップロード', '文件上传', 'Upload de Arquivo', 'Subir Archivo', 'File Upload')}
                </div>
                <div style={{ fontSize: 13, color: C.sub }}>
                  {lbl('회의 파일로 AI 요약 생성', '会議ファイルからAIサマリー作成', '通过会议文件生成AI摘要', 'Gerar resumo de reunião com IA', 'Generar resumen de reunión con IA', 'Generate AI summary from meeting file')}
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 5l4 4-4 4" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
          </div>

          <div style={{ marginTop: 20 }}>
            <MeetingTimeFeature lang={lang} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Edit screen helper components ──────────────────────────────────────────────
function EditSection({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>{emoji}</span> {title}
      </div>
      <div style={{ padding: '14px 14px', borderRadius: 14, background: C.surface, border: `1px solid ${C.border}` }}>
        {children}
      </div>
    </div>
  )
}

function EditReadRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 12, color: C.sub, width: 60, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function EditField({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.sub, marginBottom: 5 }}>{label}</div>
      <input value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        style={{ padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.bg, fontSize: 14, color: C.text, fontFamily: 'var(--font)', outline: 'none', width: '100%', boxSizing: 'border-box' }}
        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#3B62D0' }}
        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = '' }} />
    </div>
  )
}

function SummaryCell({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div style={{ fontSize: 13, color: label ? C.text : C.muted, fontWeight: label ? 500 : 400, marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {label || placeholder}
    </div>
  )
}

function SummarySection({ icon, title, items, accent = false }: { icon: string; title: string; items: string[]; accent?: boolean }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 10, background: accent ? CV.successBg : C.surface, border: `1px solid ${accent ? CV.successBorder : C.border}` }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: accent ? C.success : C.primary, marginTop: 5, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── New Business Trip Flow ───────────────────────────────────────────────────
type NewTripStep = 'country' | 'date' | 'status' | 'success'

const STATUS_OPTIONS: { key: TripStatus; icon: string; labelKey: string }[] = [
  { key: 'upcoming', icon: '📅', labelKey: 'scheduled' },
  { key: 'inProgress', icon: '🔄', labelKey: 'inProgress' },
  { key: 'completed', icon: '✅', labelKey: 'completed' },
]

function NewTripFlow({ lang, onClose, onAddTrip }: { lang: Lang; onClose: () => void; onAddTrip: (trip: Trip) => void }) {
  const t = (k: string) => i18n(lang, k)
  const [step, setStep] = useState<NewTripStep>('country')
  const [selCountry, setSelCountry] = useState<{ name: string; flag: string } | null>(null)
  const [date, setDate] = useState('')
  const [selStatus, setSelStatus] = useState<TripStatus>('upcoming')

  const stepNum = step === 'country' ? 1 : step === 'date' ? 2 : step === 'status' ? 3 : 3
  const stepLabel = t('stepOf').replace('{n}', String(stepNum))

  const handleConfirm = () => {
    if (!selCountry || !date) return
    const newTrip: Trip = {
      id: Date.now(),
      country: selCountry.name,
      flag: selCountry.flag,
      city: '',
      date: date,
      status: selStatus,
      purpose: 'Business Trip',
    }
    onAddTrip(newTrip)
    setStep('success')
    setTimeout(onClose, 1600)
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', background: C.bg }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: C.text, padding: 4 }}>‹</button>
        <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{t('newBusinessTripBtn')}</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px' }}>
        {step === 'success' ? (
          <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: CV.successBg, border: `2px solid ${CV.successBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 20 }}>✅</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text, textAlign: 'center', marginBottom: 8 }}>{t('tripAddedMsg')}</div>
            {selCountry && <div style={{ fontSize: 30, marginTop: 8, color: C.text }}>{selCountry.flag}</div>}
          </div>
        ) : step === 'country' ? (
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 4 }}>📍 {t('selectTripCountry')}</div>
            <div style={{ fontSize: 13, color: C.sub, marginBottom: 20 }}>{stepLabel}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {TRIP_COUNTRIES.map(tc => (
                <button key={tc.name} onClick={() => { setSelCountry(tc); setStep('date') }} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, border: `1.5px solid ${selCountry?.name === tc.name ? C.primary : C.border}`, background: selCountry?.name === tc.name ? C.primaryLight : C.surface, cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: 26, color: C.text }}>{tc.flag}</span>
                  <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{tc.name}</span>
                  <svg style={{ marginLeft: 'auto' }} width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
              ))}
            </div>
          </div>
        ) : step === 'date' ? (
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 4 }}>📅 {t('selectTripDate')}</div>
            <div style={{ fontSize: 13, color: C.sub, marginBottom: 20 }}>{stepLabel}</div>
            {selCountry && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', borderRadius: 14, background: C.primaryLight, border: `1px solid ${C.primary}`, marginBottom: 24 }}>
                <span style={{ fontSize: 28, color: C.text }}>{selCountry.flag}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{selCountry.name}</span>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: C.sub }}>{t('selectTripDate')}</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                style={{ padding: '13px 16px', borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.surface, fontSize: 15, color: C.text, fontFamily: 'var(--font)', outline: 'none' }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#3B62D0' }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = '' }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Btn label={t('back')} onClick={() => setStep('country')} variant="ghost" />
              <Btn label={t('confirm')} onClick={() => { if (date) setStep('status') }} />
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 4 }}>🏷️ {t('selectMeetingStatus')}</div>
            <div style={{ fontSize: 13, color: C.sub, marginBottom: 20 }}>{stepLabel}</div>
            {selCountry && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', borderRadius: 14, background: C.primaryLight, border: `1px solid ${C.primary}`, marginBottom: 20 }}>
                <span style={{ fontSize: 24, color: C.text }}>{selCountry.flag}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{selCountry.name}</div>
                  <div style={{ fontSize: 12, color: C.sub }}>{date}</div>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {STATUS_OPTIONS.map(opt => {
                const active = selStatus === opt.key
                return (
                  <button key={opt.key} onClick={() => setSelStatus(opt.key)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', borderRadius: 14, border: `2px solid ${active ? C.primary : C.border}`, background: active ? C.primaryLight : C.surface, cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ fontSize: 24 }}>{opt.icon}</span>
                    <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: active ? C.primary : C.text }}>{t(opt.labelKey)}</span>
                    {active && <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill={C.primary} /><path d="M5 10l3.5 3.5L15 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </button>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Btn label={t('back')} onClick={() => setStep('date')} variant="ghost" />
              <Btn label={t('confirmTripBtn')} onClick={handleConfirm} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Trip List ────────────────────────────────────────────────────────────────
function TripListScreen({ lang, trips, onOpen, onNewTrip, onDeleteTrip, onChangeStatus }: {
  lang: Lang; trips: Trip[]; onOpen: (t: Trip) => void; onNewTrip: () => void
  onDeleteTrip: (id: number) => void; onChangeStatus: (id: number, status: TripStatus) => void
}) {
  const t = (k: string) => i18n(lang, k)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [changeStatusId, setChangeStatusId] = useState<number | null>(null)
  const [pendingStatus, setPendingStatus] = useState<TripStatus | null>(null)
  const statusBg:  Record<TripStatus, string> = { upcoming: CV.blueTint, inProgress: CV.inProgressBg, completed: C.surface2 }
  const statusFg:  Record<TripStatus, string> = { upcoming: C.primary, inProgress: CV.inProgressText, completed: C.muted }
  const statusKey: Record<TripStatus, string> = { upcoming: 'upcoming', inProgress: 'inProgress', completed: 'completed' }

  const closeMenu = () => setOpenMenuId(null)

  const openChangeStatus = (trip: Trip) => {
    setPendingStatus(trip.status)
    setChangeStatusId(trip.id)
    closeMenu()
  }

  const saveStatus = () => {
    if (changeStatusId !== null && pendingStatus !== null) {
      onChangeStatus(changeStatusId, pendingStatus)
    }
    setChangeStatusId(null)
    setPendingStatus(null)
  }

  const statusOptions: { key: TripStatus; icon: string; labelKey: string }[] = [
    { key: 'upcoming', icon: '📅', labelKey: 'scheduled' },
    { key: 'inProgress', icon: '🔄', labelKey: 'inProgress' },
    { key: 'completed', icon: '✅', labelKey: 'completed' },
  ]

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Backdrop to close dropdown */}
      {openMenuId !== null && (
        <div onClick={closeMenu} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
      )}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div style={{ padding: '16px 20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: '-0.03em' }}>{t('businessTripTitle')}</h2>
            <button onClick={onNewTrip} style={{ padding: '8px 16px', borderRadius: 100, background: `linear-gradient(135deg, #3B62D0 0%, #052659 100%)`, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font)', boxShadow: '0 3px 10px rgba(5,38,89,0.25)' }}>{t('newBusinessTripBtn')}</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
            {([{ labelKey: 'thisYear', value: String(trips.length), icon: '✈️' }, { labelKey: 'countriesLabel', value: String(new Set(trips.map(tr => tr.country)).size), icon: '🌍' }, { labelKey: 'upcomingLabel', value: String(trips.filter(tr => tr.status === 'upcoming').length), icon: '📅' }] as const).map(s => (
              <div key={s.labelKey} style={{ padding: '14px 12px', borderRadius: 18, background: C.surface, border: `1px solid ${C.border}`, textAlign: 'center', boxShadow: '0 2px 8px rgba(5,38,89,0.05)' }}>
                <div style={{ fontSize: 18 }}>{s.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.text, letterSpacing: '-0.02em' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: C.sub, fontWeight: 500 }}>{t(s.labelKey)}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {trips.map(trip => (
              <div key={trip.id} style={{ position: 'relative' }}>
                <button onClick={() => onOpen(trip)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', paddingRight: 52, borderRadius: 20, border: `1px solid ${C.border}`, background: C.bg, cursor: 'pointer', textAlign: 'left', width: '100%', boxShadow: '0 3px 12px rgba(5,38,89,0.07)' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, color: C.text }}>{trip.flag}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trip.country}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: statusBg[trip.status], color: statusFg[trip.status], flexShrink: 0 }}>{t(statusKey[trip.status])}</span>
                    </div>
                    {trip.city && <div style={{ fontSize: 13, color: C.sub, marginBottom: 4 }}>{trip.city}{trip.purpose ? ` · ${trip.purpose}` : ''}</div>}
                    <div style={{ fontSize: 12, color: C.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="2" width="10" height="9" rx="2" stroke={C.muted} strokeWidth="1.2" /><path d="M1 5h10" stroke={C.muted} strokeWidth="1.2" /><path d="M4 1v2M8 1v2" stroke={C.muted} strokeWidth="1.2" strokeLinecap="round" /></svg>
                      {trip.date}
                    </div>
                  </div>
                </button>

                {/* Three-dot menu button */}
                <button
                  onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === trip.id ? null : trip.id) }}
                  style={{ position: 'absolute', right: 12, top: 10, width: 28, height: 28, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11, padding: 0 }}
                >
                  <svg width="4" height="16" viewBox="0 0 4 16" fill="none">
                    <circle cx="2" cy="2" r="1.5" fill={C.sub} />
                    <circle cx="2" cy="8" r="1.5" fill={C.sub} />
                    <circle cx="2" cy="14" r="1.5" fill={C.sub} />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {openMenuId === trip.id && (
                  <div onClick={e => e.stopPropagation()} style={{ position: 'absolute', right: 12, top: 42, zIndex: 20, background: C.bg, borderRadius: 12, border: `1px solid ${C.border}`, boxShadow: '0 8px 24px rgba(5,38,89,0.14)', overflow: 'hidden', minWidth: 160 }}>
                    <button
                      onClick={() => openChangeStatus(trip)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, color: C.text, textAlign: 'left' }}
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 13.5H13.5M1.5 13.5H2.66636C2.99248 13.5 3.15554 13.5 3.30899 13.4632C3.44504 13.4306 3.5751 13.3767 3.69439 13.3036C3.82895 13.2211 3.94425 13.1059 4.17485 12.8753L11.5 5.55015C12.0523 4.99786 12.0523 4.10243 11.5 3.55015C10.9477 2.99786 10.0523 2.99786 9.5 3.55015L2.17485 10.8753C1.94424 11.1059 1.82894 11.2212 1.74649 11.3558C1.67338 11.4751 1.61951 11.6051 1.58685 11.7412C1.55001 11.8947 1.55001 12.0577 1.55001 12.3838V13.5H7.5Z" stroke={C.primary} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" /></svg>
                      {t('changeStatus')}
                    </button>
                    <div style={{ height: 1, background: C.border, margin: '0 12px' }} />
                    <button
                      onClick={() => { closeMenu(); setDeleteConfirmId(trip.id) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 14, fontWeight: 500, color: C.error, textAlign: 'left' }}
                    >
                      <svg width="15" height="15" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V3h4v1M3 4l1 8h6l1-8" stroke={C.error} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      {t('delete')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Change Status Modal */}
      {changeStatusId !== null && (
        <div style={{ position: 'absolute', inset: 0, background: CV.overlay, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}>
          <div className="anim-up" style={{ background: C.bg, borderRadius: '24px 24px 0 0', padding: '8px 24px 40px', width: '100%' }}>
            <div style={{ width: 36, height: 4, background: C.border, borderRadius: 100, margin: '12px auto 20px' }} />
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 16, textAlign: 'center' }}>{t('selectMeetingStatus')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {statusOptions.map(opt => {
                const active = pendingStatus === opt.key
                return (
                  <button key={opt.key} onClick={() => setPendingStatus(opt.key)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, border: `2px solid ${active ? C.primary : C.border}`, background: active ? C.primaryLight : C.surface, cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font)' }}>
                    <span style={{ fontSize: 22 }}>{opt.icon}</span>
                    <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: active ? C.primary : C.text }}>{t(opt.labelKey)}</span>
                    {active && <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill={C.primary} /><path d="M5 10l3.5 3.5L15 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </button>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Btn label={t('cancel')} onClick={() => { setChangeStatusId(null); setPendingStatus(null) }} variant="ghost" />
              <Btn label={t('saveStatus')} onClick={saveStatus} />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div style={{ position: 'absolute', inset: 0, background: CV.overlay, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}>
          <div className="anim-up" style={{ background: C.bg, borderRadius: '24px 24px 0 0', padding: '8px 24px 40px', width: '100%' }}>
            <div style={{ width: 36, height: 4, background: C.border, borderRadius: 100, margin: '12px auto 24px' }} />
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 8 }}>{t('deleteTripBtn')}</div>
              <div style={{ fontSize: 14, color: C.sub }}>{t('deleteConfirmMsg')}</div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Btn label={t('cancel')} onClick={() => setDeleteConfirmId(null)} variant="ghost" />
              <Btn label={t('delete')} onClick={() => { onDeleteTrip(deleteConfirmId!); setDeleteConfirmId(null) }} variant="danger" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TripDetailScreen({ lang, trip, onBack }: { lang: Lang; trip: Trip; onBack: () => void }) {
  const t = (k: string) => i18n(lang, k)
  const guide = getGuide(trip.country, lang)
  const [expanded, setExpanded] = useState<number | null>(0)
  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px 16px', borderBottom: `1px solid ${C.border}`, background: C.bg, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: C.text, padding: 4 }}>‹</button>
          <div style={{ fontSize: 24, color: C.text }}>{trip.flag}</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>{t('businessGuide')}: {trip.country}</div>
            <div style={{ fontSize: 12, color: C.sub }}>{trip.city && `${trip.city} · `}{trip.date}</div>
          </div>
        </div>
        {guide && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {([
              { icon: '💱', labelKey: 'currencyLabel', value: guide.currency.split('·')[0].trim() },
              { icon: '🕐', labelKey: 'timezoneLabel', value: guide.timezone.split('(')[0].trim() },
              { icon: '🌡️', labelKey: 'weatherLabel', value: guide.weather.split(':')[1]?.trim().split('.')[0] ?? '—' },
              { icon: '🚨', labelKey: 'emergencyLabel', value: guide.emergency.split('·')[0].trim() },
            ] as const).map(q => (
              <div key={q.labelKey} style={{ padding: '10px 12px', borderRadius: 12, background: C.surface, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 14 }}>{q.icon}</div>
                <div style={{ fontSize: 10, color: C.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>{t(q.labelKey)}</div>
                <div style={{ fontSize: 12, color: C.text, fontWeight: 600, marginTop: 2, lineHeight: 1.3 }}>{q.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 16px 24px', background: C.bg }}>
        {!guide ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: C.sub }}>{t('cultureSoon')} {trip.country}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {guide.sections.map((s, i) => (
              <div key={i} style={{ borderRadius: 16, border: `1px solid ${expanded === i ? C.primary : C.border}`, background: expanded === i ? C.primaryLight : C.bg, overflow: 'hidden' }}>
                <button onClick={() => setExpanded(expanded === i ? null : i)} style={{ width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: expanded === i ? C.primary : C.text }}>{t(s.titleKey)}</span>
                  <svg style={{ transform: expanded === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke={expanded === i ? C.primary : C.sub} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                {expanded === i && <div style={{ padding: '0 16px 16px' }}><p style={{ fontSize: 14, color: C.text, lineHeight: 1.65, margin: 0 }}>{s.content}</p></div>}
              </div>
            ))}
            {([
              { icon: '🚌', labelKey: 'transportLabel', value: guide.transport },
              { icon: '🌤️', labelKey: 'weatherLabel', value: guide.weather },
              { icon: '🚨', labelKey: 'emergencyLabel', value: guide.emergency },
            ] as const).map((s, i) => (
              <div key={`extra-${i}`} style={{ borderRadius: 16, border: `1px solid ${C.border}`, background: C.bg, padding: '14px 16px' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>{t(s.labelKey)}</div>
                    <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.6 }}>{s.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab({ lang, profile, onEditProfile, onLangSettings, onLogout, showToast, onToggleNotif, onToggleDark }: {
  lang: Lang; profile: UserProfile; onEditProfile: () => void; onLangSettings: () => void
  onLogout: () => void; showToast: (msg: string) => void; onToggleNotif: () => void; onToggleDark: () => void
}) {
  const t = (k: string) => i18n(lang, k)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showPasswordVerify, setShowPasswordVerify] = useState(false)
  const [verifyInput, setVerifyInput] = useState('')
  const [verifyError, setVerifyError] = useState('')

  const handleEditProfileClick = () => { setVerifyInput(''); setVerifyError(''); setShowPasswordVerify(true) }

  const handlePasswordVerify = () => {
    const storedPassword = profile.password
    // Accept any non-empty input if no password is stored (demo login without signup)
    const isCorrect = storedPassword ? verifyInput === storedPassword : verifyInput.length > 0
    if (isCorrect) { setShowPasswordVerify(false); onEditProfile() }
    else setVerifyError(t('wrongPassword'))
  }

  const initials = profile.name ? profile.name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'

  // Chevron icon reused across menu rows
  const ChevronRight = () => (
    <svg width="7.5" height="13.5" viewBox="0 0 7.5 13.5" fill="none">
      <path d="M0.75 12.75L6.75 6.75L0.75 0.75" stroke={C.sub} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
  // Toggle knob reused for notifications and dark mode
  const Toggle = ({ on }: { on: boolean }) => (
    <div style={{ width: 46, height: 26, borderRadius: 13, background: on ? C.primary : C.border, position: 'relative', flexShrink: 0 }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left 0.2s' }} />
    </div>
  )

  // Unified row style
  const rowStyle = (highlighted = false): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px',
    width: '100%', background: highlighted ? C.surface : 'transparent',
    border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: "'Poppins', sans-serif",
  })
  const labelStyle: React.CSSProperties = { flex: 1, fontSize: 14, color: C.text, fontWeight: 400, fontFamily: "'Poppins', sans-serif", lineHeight: '20px' }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div style={{ padding: '20px 20px 24px' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: '0 0 20px', fontFamily: "'Poppins', sans-serif" }}>{t('profile')}</h2>

          {/* ── Avatar + name/email header ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: C.primaryLight, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 600, color: C.primary }}>
              {initials}
            </div>
            <div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: C.text, lineHeight: '18px', margin: 0, fontWeight: 400 }}>
                {profile.name || t('namePlaceholder')}
              </p>
              <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, color: C.sub, lineHeight: '16px', margin: 0 }}>
                {profile.email || 'yourname@gmail.com'}
              </p>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, background: C.primary, color: '#fff' }}>{t('proPlan')}</span>
                <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 100, background: C.bg, color: C.sub, border: `1px solid ${C.border}` }}>
                  {LANGUAGES.find(l => l.code === profile.lang)?.flag} {LANGUAGES.find(l => l.code === profile.lang)?.name}
                </span>
              </div>
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={{ height: 1, background: C.border, marginBottom: 16 }} />

          {/* ── Menu list ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

            {/* Edit Profile */}
            <button onClick={handleEditProfileClick} style={rowStyle()}>
              <svg width="24" height="24" viewBox="0 0 17.5001 19.5" fill="none">
                <path d="M16.75 18.75C16.75 17.3544 16.75 16.6567 16.5778 16.0889C16.19 14.8105 15.1896 13.81 13.9112 13.4222C13.3434 13.25 12.6456 13.25 11.25 13.25H6.25005C4.85448 13.25 4.1567 13.25 3.5889 13.4222C2.3105 13.81 1.31008 14.8105 0.922281 16.0889C0.750041 16.6567 0.750041 17.3544 0.750041 18.75M13.25 5.25C13.25 7.73528 11.2353 9.75 8.75004 9.75C6.26476 9.75 4.25004 7.73528 4.25004 5.25C4.25004 2.76472 6.26476 0.75 8.75004 0.75C11.2353 0.75 13.25 2.76472 13.25 5.25Z" stroke={C.text} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
              <span style={labelStyle}>{t('editProfile')}</span>
              <ChevronRight />
            </button>

            {/* Notifications */}
            <button onClick={onToggleNotif} style={rowStyle()}>
              <svg width="24" height="24" viewBox="0 0 18.978 21.5" fill="none">
                <path d="M6.84318 19.75C7.54831 20.3724 8.47456 20.75 9.489 20.75C10.5035 20.75 11.4297 20.3724 12.1348 19.75M15.489 6.75C15.489 5.1587 14.8569 3.63258 13.7316 2.50736C12.6064 1.38214 11.0803 0.75 9.489 0.75C7.89771 0.75 6.37158 1.38214 5.24636 2.50736C4.12115 3.63258 3.489 5.1587 3.489 6.75C3.489 9.84018 2.70947 11.956 1.83867 13.3554C1.10413 14.5359 0.736862 15.1261 0.750329 15.2908C0.76524 15.4731 0.803864 15.5426 0.95078 15.6516C1.08346 15.75 1.68159 15.75 2.87786 15.75H16.1001C17.2964 15.75 17.8945 15.75 18.0272 15.6516C18.1741 15.5426 18.2128 15.4731 18.2277 15.2908C18.2411 15.1261 17.8739 14.5359 17.1393 13.3554C16.2685 11.956 15.489 9.84019 15.489 6.75Z" stroke={C.text} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
              <span style={labelStyle}>{t('notifSettings')}</span>
              <Toggle on={profile.notifications} />
            </button>

            {/* Language Settings */}
            <button onClick={onLangSettings} style={rowStyle()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke={C.text} strokeWidth="1.5" />
                <path d="M12 2C12 2 8 7 8 12C8 17 12 22 12 22" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 2C12 2 16 7 16 12C16 17 12 22 12 22" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2 12H22" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span style={labelStyle}>{t('langSettings')}</span>
              <ChevronRight />
            </button>

            {/* Dark Mode */}
            <button onClick={onToggleDark} style={rowStyle()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={labelStyle}>{t('darkMode')}</span>
              <Toggle on={profile.darkMode} />
            </button>

            {/* Help & Support */}
            <button onClick={() => showToast(t('helpSupport'))} style={rowStyle()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke={C.text} strokeWidth="1.5" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="17" r="0.5" fill={C.text} stroke={C.text} strokeWidth="1.5" />
              </svg>
              <span style={labelStyle}>{t('helpSupport')}</span>
              <ChevronRight />
            </button>

            {/* Privacy Policy */}
            <button onClick={() => showToast(t('privacyPolicy'))} style={rowStyle()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" stroke={C.text} strokeWidth="1.5" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span style={labelStyle}>{t('privacyPolicy')}</span>
              <ChevronRight />
            </button>

            {/* Log Out */}
            <button onClick={() => setShowLogoutModal(true)} style={rowStyle()}>
              <svg width="24" height="24" viewBox="0 0 21.5 19.5" fill="none">
                <path d="M16.75 13.75L20.75 9.75L16.75 5.75M20.75 9.75H7.75M13.75 1.95404C12.4752 1.18827 10.9952 0.75 9.41667 0.75C4.6302 0.75 0.75 4.77944 0.75 9.75C0.75 14.7206 4.6302 18.75 9.41667 18.75C10.9952 18.75 12.4752 18.3117 13.75 17.546" stroke={C.text} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
              <span style={{ ...labelStyle, color: C.error }}>{t('logout')}</span>
            </button>
          </div>
        </div>
      </div>
      {/* Password Verification Modal */}
      {showPasswordVerify && (
        <div style={{ position: 'absolute', inset: 0, background: CV.overlay, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
          <div className="anim-up" style={{ background: C.bg, borderRadius: '24px 24px 0 0', padding: '8px 24px 40px', width: '100%' }}>
            <div style={{ width: 36, height: 4, background: C.border, borderRadius: 100, margin: '12px auto 24px' }} />
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 60, height: 60, borderRadius: 20, background: C.primaryLight, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🔒</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>{t('verifyPasswordTitle')}</div>
              <div style={{ fontSize: 14, color: C.sub }}>{t('verifyPasswordSub')}</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <input
                type="password"
                value={verifyInput}
                onChange={e => { setVerifyInput(e.target.value); setVerifyError('') }}
                placeholder={t('passwordPlaceholder')}
                onKeyDown={e => e.key === 'Enter' && handlePasswordVerify()}
                style={{ width: '100%', padding: '13px 18px', borderRadius: 100, border: `1.5px solid ${verifyError ? C.error : C.border}`, background: '#fff', fontSize: 15, color: C.text, fontFamily: 'var(--font)', outline: 'none', boxSizing: 'border-box', boxShadow: '0 1px 4px rgba(5,38,89,0.06)' }}
              />
              {verifyError && <div style={{ fontSize: 12, color: C.error, marginTop: 6, paddingLeft: 4 }}>{verifyError}</div>}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Btn label={t('cancel')} onClick={() => { setShowPasswordVerify(false); setVerifyError('') }} variant="ghost" />
              <Btn label={t('confirm')} onClick={handlePasswordVerify} />
            </div>
          </div>
        </div>
      )}
      {showLogoutModal && (
        <div style={{ position: 'absolute', inset: 0, background: CV.overlay, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
          <div className="anim-up" style={{ background: C.bg, borderRadius: '24px 24px 0 0', padding: '8px 24px 40px', width: '100%' }}>
            <div style={{ width: 36, height: 4, background: C.border, borderRadius: 100, margin: '12px auto 24px' }} />
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>{t('logout')}?</div>
              <div style={{ fontSize: 14, color: C.sub }}>{t('logoutConfirm')}</div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Btn label={t('cancel')} onClick={() => setShowLogoutModal(false)} variant="ghost" />
              <Btn label={t('logout')} onClick={() => { setShowLogoutModal(false); onLogout() }} variant="danger" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Edit Profile field row (defined outside component to stay stable across renders) ──
function EditFieldRow({ label, value, onChange, type = 'text', placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0 24px' }}>
        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, color: C.text, fontWeight: 400, lineHeight: '24px' }}>{label}</span>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, color: C.sub, textAlign: 'right', border: 'none', background: 'transparent', outline: 'none', maxWidth: '55%' }}
        />
      </div>
      <div style={{ height: 1, background: C.border }} />
    </div>
  )
}

// ─── Edit Profile ─────────────────────────────────────────────────────────────
function EditProfileScreen({ lang, profile, onSave, onBack, showToast }: {
  lang: Lang; profile: UserProfile; onSave: (p: Partial<UserProfile>) => void; onBack: () => void; showToast: (msg: string) => void
}) {
  const t = (k: string) => i18n(lang, k)
  const [name, setName] = useState(profile.name); const [company, setCompany] = useState(profile.company)
  const [email, setEmail] = useState(profile.email); const [country, setCountry] = useState(profile.country)
  const handleSave = () => { onSave({ name, company, email, country }); showToast(t('profileSaved')); onBack() }
  const editInitials = name.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <div className="anim-slide" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: C.bg, minHeight: 0 }}>
      <StatusBar />
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 24px 32px' }}>

        {/* ── Header: avatar + name/email + X close ── */}
        <div style={{ position: 'relative', marginBottom: 26 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {/* Circular avatar with edit badge */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 600, color: C.primary }}>
                {editInitials}
              </div>
              {/* Edit pencil badge */}
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 25, height: 25, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(26,15,1,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 13.5001 12.9143" fill="none">
                  <path d="M6.75007 12.1642H12.7501M0.750086 12.1642H1.86645C2.19257 12.1642 2.35563 12.1642 2.50908 12.1274C2.64513 12.0947 2.77519 12.0408 2.89448 11.9677C3.02904 11.8853 3.14434 11.77 3.37494 11.5394L11.7501 3.16421C12.3024 2.61193 12.3024 1.7165 11.7501 1.16421C11.1978 0.611929 10.3024 0.611929 9.7501 1.16421L1.37493 9.53937C1.14432 9.76998 1.02902 9.88528 0.946567 10.0198C0.873461 10.1391 0.819589 10.2692 0.786927 10.4052C0.750086 10.5587 0.750086 10.7217 0.750086 11.0479V12.1642Z" stroke="#4B5563" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
            {/* Name + email */}
            <div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, color: C.text, margin: 0, lineHeight: '24px', fontWeight: 400 }}>{name || t('namePlaceholder')}</p>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, color: C.sub, margin: 0, lineHeight: '20px' }}>{email || 'yourname@gmail.com'}</p>
            </div>
          </div>
          {/* X close button — top-right */}
          <button onClick={onBack} style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 11.5 11.5" fill="none">
              <path d="M10.75 0.75L0.75 10.75M0.75 0.75L10.75 10.75" stroke={C.text} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: C.border, marginBottom: 24 }} />

        {/* ── Field rows ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 48 }}>
          <EditFieldRow label={t('fullName')} value={name} onChange={setName} placeholder={t('namePlaceholder')} />
          <div style={{ height: 24 }} />
          <EditFieldRow label={t('email')} value={email} onChange={setEmail} type="email" placeholder={t('emailPlaceholder')} />
          <div style={{ height: 24 }} />
          <EditFieldRow label={t('companyName')} value={company} onChange={setCompany} placeholder={t('companyPlaceholder')} />
          <div style={{ height: 24 }} />
          <EditFieldRow label={t('countryField')} value={country} onChange={setCountry} placeholder="—" />
        </div>

        {/* ── Save button ── */}
        <button onClick={handleSave} style={{ background: C.primary, color: '#fff', border: 'none', borderRadius: 6, height: 36, padding: '0 24px', fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 14, cursor: 'pointer', lineHeight: '20px' }}>
          {t('save')}
        </button>
      </div>
      <HomeIndicator />
    </div>
  )
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({ tab, setTab, lang }: { tab: Tab; setTab: (t: Tab) => void; lang: Lang }) {
  const t = (k: string) => i18n(lang, k)
  const items: { key: Tab; labelKey: string; icon: (active: boolean) => React.ReactNode }[] = [
    { key: 'meetings', labelKey: 'meetings', icon: a => (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="4" width="16" height="15" rx="3" stroke={a ? C.primary : C.muted} strokeWidth="1.6" fill={a ? C.primaryLight : 'none'} /><path d="M8 2v4M14 2v4" stroke={a ? C.primary : C.muted} strokeWidth="1.6" strokeLinecap="round" /><path d="M3 9h16" stroke={a ? C.primary : C.muted} strokeWidth="1.6" /><circle cx="8" cy="14" r="1.5" fill={a ? C.primary : C.muted} /><circle cx="14" cy="14" r="1.5" fill={a ? C.primary : C.muted} /></svg>) },
    { key: 'messages', labelKey: 'messages', icon: a => (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 4h16a1 1 0 011 1v9a1 1 0 01-1 1H7l-4 3V5a1 1 0 011-1z" stroke={a ? C.primary : C.muted} strokeWidth="1.6" fill={a ? C.primaryLight : 'none'} strokeLinejoin="round" /></svg>) },
    { key: 'trip',     labelKey: 'trip',     icon: a => (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 19l4-8 4 4 4-7 4 11" stroke={a ? C.primary : C.muted} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M11 3C9 5 7 8 7 10.5C7 12.4 8.8 14 11 14s4-1.6 4-3.5C15 8 13 5 11 3z" stroke={a ? C.primary : C.muted} strokeWidth="1.6" /></svg>) },
    { key: 'profile',  labelKey: 'profile',  icon: a => (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="8" r="4" stroke={a ? C.primary : C.muted} strokeWidth="1.6" fill={a ? C.primaryLight : 'none'} /><path d="M3 19c0-4 3.6-7 8-7s8 3 8 7" stroke={a ? C.primary : C.muted} strokeWidth="1.6" strokeLinecap="round" /></svg>) },
  ]
  return (
    <div style={{ flexShrink: 0, background: C.bg, borderTop: `1px solid ${C.border}`, display: 'flex', padding: '6px 0 0', boxShadow: '0 -2px 16px rgba(5,38,89,0.06)' }}>
      {items.map(item => {
        const active = tab === item.key
        return (
          <button key={item.key} onClick={() => setTab(item.key)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 4px 4px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            {item.icon(active)}
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, color: active ? C.primary : C.muted }}>{t(item.labelKey)}</span>
            {active && <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.primary, marginTop: 1 }} />}
          </button>
        )
      })}
    </div>
  )
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function HomeScreen({ lang, profile, tab, setTab, convos, setConvos, trips, setTrips, onLangSettings, onLogout, onEditProfile, onUpdateProfile, showToast }: {
  lang: Lang; profile: UserProfile; tab: Tab; setTab: (t: Tab) => void
  convos: Convo[]; setConvos: React.Dispatch<React.SetStateAction<Convo[]>>
  trips: Trip[]; setTrips: React.Dispatch<React.SetStateAction<Trip[]>>
  onLangSettings: () => void; onLogout: () => void
  onEditProfile: () => void; onUpdateProfile: (p: Partial<UserProfile>) => void; showToast: (msg: string) => void
}) {
  const [chatView, setChatView] = useState<ChatView>('list')
  const [tripView, setTripView] = useState<TripView>('list')
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [selectedConvoId, setSelectedConvoId] = useState<number | null>(null)
  const selectedConvo = convos.find(c => c.id === selectedConvoId) ?? null

  const openChat = (c: Convo) => { setSelectedConvoId(c.id); setChatView('detail') }

  const markRead = (convoId: number) => {
    setConvos(prev => prev.map(c => c.id === convoId ? { ...c, messages: c.messages.map(m => ({ ...m, read: true })) } : c))
  }

  const appendMessage = (convoId: number, msg: Message) => {
    setConvos(prev => prev.map(c => c.id !== convoId ? c : { ...c, messages: [...c.messages, msg], lastMessage: msg.text, time: { k: 'now' } as ConvoTime }))
  }

  const addTrip = (trip: Trip) => {
    setTrips(prev => [trip, ...prev])
    showToast(i18n(lang, 'tripAddedMsg'))
  }

  const deleteTrip = (id: number) => {
    setTrips(prev => prev.filter(tr => tr.id !== id))
  }

  const changeStatus = (id: number, status: TripStatus) => {
    setTrips(prev => prev.map(tr => tr.id === id ? { ...tr, status } : tr))
  }

  const showNavBar = !(tab === 'messages' && chatView === 'detail') && !(tab === 'trip' && (tripView === 'detail' || tripView === 'new'))

  const handleSetTab = (t: Tab) => { setTab(t); setChatView('list'); setTripView('list') }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.bg }}>
      <StatusBar />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {tab === 'messages' && chatView === 'list' && <ChatListScreen lang={lang} convos={convos} onOpen={openChat} />}
        {tab === 'messages' && chatView === 'detail' && selectedConvo && (
          <ChatDetailScreen lang={lang} convo={selectedConvo} onBack={() => { setChatView('list'); setSelectedConvoId(null) }} showToast={showToast} onMarkRead={() => markRead(selectedConvo.id)} onSendMessage={msg => appendMessage(selectedConvo.id, msg)} />
        )}
        {tab === 'meetings' && <MeetingsTab lang={lang} profile={profile} />}
        {tab === 'trip' && tripView === 'list' && <TripListScreen lang={lang} trips={trips} onOpen={tr => { setSelectedTrip(tr); setTripView('detail') }} onNewTrip={() => setTripView('new')} onDeleteTrip={deleteTrip} onChangeStatus={changeStatus} />}
        {tab === 'trip' && tripView === 'detail' && selectedTrip && <TripDetailScreen lang={lang} trip={selectedTrip} onBack={() => { setTripView('list'); setSelectedTrip(null) }} />}
        {tab === 'trip' && tripView === 'new' && <NewTripFlow lang={lang} onClose={() => setTripView('list')} onAddTrip={addTrip} />}
        {tab === 'profile' && (
          <ProfileTab lang={lang} profile={profile} onEditProfile={onEditProfile} onLangSettings={onLangSettings} onLogout={onLogout} showToast={showToast}
            onToggleNotif={() => onUpdateProfile({ notifications: !profile.notifications })}
            onToggleDark={() => onUpdateProfile({ darkMode: !profile.darkMode })} />
        )}
      </div>
      {showNavBar && <BottomNav tab={tab} setTab={handleSetTab} lang={lang} />}
      <HomeIndicator />
    </div>
  )
}

// ─── App Root ─────────────────────────────────────────────────────────────────
const EMPTY_PROFILE: UserProfile = {
  name: '', company: '', email: '', country: '',
  lang: 'en', notifications: true, darkMode: false, password: '',
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [lang, setLang] = useState<Lang>('en')
  const [toast, setToast] = useState('')
  const [editingProfile, setEditingProfile] = useState(false)
  const [langFromProfile, setLangFromProfile] = useState(false)
  const [pendingSignup, setPendingSignup] = useState<SignupData | null>(null)

  // Saved credentials from signup — used for login validation
  const [savedUser, setSavedUser] = useState<{ email: string; password: string } | null>(null)

  // Lifted state — survives profile/lang subscreen navigation
  const [homeTab, setHomeTab] = useState<Tab>('meetings')
  const [convos, setConvos] = useState<Convo[]>(CONVOS_INIT)
  const [trips, setTrips] = useState<Trip[]>(TRIPS_INIT)

  const [profile, setProfile] = useState<UserProfile>(() => ({
    ...EMPTY_PROFILE,
    darkMode: localStorage.getItem('gcai-dark') === '1',
  }))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', profile.darkMode)
    localStorage.setItem('gcai-dark', profile.darkMode ? '1' : '0')
  }, [profile.darkMode])

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const showToast = (msg: string) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2500)
  }

  const handleSignupCreated = (data: SignupData) => {
    setSavedUser({ email: data.email, password: data.password })
    setPendingSignup(data)
    setScreen('langSelect')
  }

  const handleLangSelect = (l: Lang) => {
    setLang(l)
    if (pendingSignup) {
      setProfile(p => ({ ...EMPTY_PROFILE, name: pendingSignup.name, company: pendingSignup.company, email: pendingSignup.email, lang: l, notifications: true, darkMode: p.darkMode, password: pendingSignup.password }))
      setPendingSignup(null)
    } else {
      setProfile(p => ({ ...p, lang: l }))
    }
    showToast(i18n(l, 'langUpdated'))
    // Always return to profile tab if opened from profile settings
    if (langFromProfile) setHomeTab('profile')
    setLangFromProfile(false)
    setScreen('home')
  }

  const handleLogout = () => {
    setProfile(p => ({ ...EMPTY_PROFILE, lang, darkMode: p.darkMode }))
    setEditingProfile(false)
    setHomeTab('meetings')
    setConvos(CONVOS_INIT)
    setTrips(TRIPS_INIT)
    setScreen('login')
  }

  const handleUpdateProfile = (updates: Partial<UserProfile>) => setProfile(p => ({ ...p, ...updates }))

  const handleEditProfile = () => { setHomeTab('profile'); setEditingProfile(true) }
  const handleBackFromEditProfile = () => { setHomeTab('profile'); setEditingProfile(false) }
  const handleLangSettings = () => { setLangFromProfile(true); setHomeTab('profile'); setScreen('langSelect') }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #A8CCE8 0%, #C1E8FF 50%, #7DA0CA 100%)', overflow: 'auto', padding: '16px', boxSizing: 'border-box' }}>
      <div style={{ width: 393, height: 852, minWidth: 393, minHeight: 852, borderRadius: 54, background: C.bg, boxShadow: '0 40px 120px rgba(5,38,89,0.45), 0 0 0 10px #052659, 0 0 0 12px #021024', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: 'var(--font)', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, borderRadius: 20, background: '#000', zIndex: 100 }} />
        {toast && <Toast msg={toast} />}
        {screen === 'splash'     && <SplashScreen lang={lang} onStart={() => setScreen('login')} />}
        {screen === 'login'      && <LoginScreen lang={lang} savedUser={savedUser} onLogin={() => setScreen('home')} onSignUp={() => setScreen('signup')} showToast={showToast} />}
        {screen === 'signup'     && <SignUpScreen lang={lang} onCreated={handleSignupCreated} onBack={() => setScreen('login')} showToast={showToast} />}
        {screen === 'langSelect' && <LangSelectScreen lang={lang} onSelect={handleLangSelect} onBack={() => { setLangFromProfile(false); setScreen('home') }} isSettings={langFromProfile} />}
        {screen === 'home' && !editingProfile && (
          <HomeScreen lang={lang} profile={profile}
            tab={homeTab} setTab={setHomeTab}
            convos={convos} setConvos={setConvos}
            trips={trips} setTrips={setTrips}
            onLangSettings={handleLangSettings}
            onLogout={handleLogout}
            onEditProfile={handleEditProfile}
            onUpdateProfile={handleUpdateProfile}
            showToast={showToast} />
        )}
        {screen === 'home' && editingProfile && (
          <EditProfileScreen lang={lang} profile={profile} onSave={handleUpdateProfile} onBack={handleBackFromEditProfile} showToast={showToast} />
        )}
      </div>
    </div>
  )
}
