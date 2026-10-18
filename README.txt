# গল্পকথা — Firebase-চালিত static story website

এই সংস্করণটি আপনার আগের `index.html` ও `style.css` ডিজাইন ধরে রেখেছে। গল্প Firestore-এ থাকে, তাই একই URL খুললে যেকোনো ইন্টারনেট-যুক্ত ফোন/কম্পিউটারে গল্প দেখা যায়। সাধারণ HTML/CSS/JavaScript; কোনো সার্ভার নিজে চালাতে হবে না।

## ফাইল
- `index.html` — পাঠকের ওয়েবসাইট
- `admin.html` — অ্যাডমিন লগইন ও গল্প প্রকাশ
- `style.css` — ডিজাইন
- `app.js` — Firestore থেকে গল্প দেখানো, সার্চ ও ক্যাটাগরি
- `admin.js` — Firebase Authentication দিয়ে লগইন, গল্প প্রকাশ/ডিলিট
- `firebase-config.js` — আপনার Firebase Web App config
- `firestore.rules` — Firestore-এর নিরাপত্তা নিয়ম

## সেটআপ (Android ফোন থেকেও করা যায়)

1. Firebase Console-এ `golpokotha` project খুলুন।
2. **Authentication → Sign-in method → Email/Password** চালু আছে নিশ্চিত করুন।
3. Authentication → Users থেকে আপনার অ্যাডমিন ইউজারের **UID** কপি করুন। পাসওয়ার্ড কখনো কোডে লিখবেন না।
4. `firebase-config.js` ফাইলে আপনার Web app-এর `firebaseConfig`-এর `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId` বসান। Firebase Console → Project settings → Your apps-এ পাওয়া যায়। `projectId` অবশ্যই আপনার আসল project ID হবে।
5. `firestore.rules`-এ `PASTE_ADMIN_UID_HERE`-এর জায়গায় Authentication Users থেকে কপি করা অ্যাডমিন UID বসান।
6. Firebase Console → Firestore Database → Rules-এ `firestore.rules`-এর সম্পূর্ণ নিয়ম পেস্ট করে **Publish** চাপুন।
7. ফাইলগুলো একই ফোল্ডারে রেখে static hosting-এ আপলোড করুন। যেমন Firebase Hosting, GitHub Pages বা Netlify। সব ফাইলের মধ্যে `index.html`, `admin.html`, `style.css`, `app.js`, `admin.js`, `firebase-config.js` থাকতে হবে।
8. প্রকাশিত সাইটের `/admin.html` খুলে অ্যাডমিন ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন। গল্প প্রকাশ করুন। পাঠকেরা মূল সাইটের URL-এ গল্প দেখতে পাবে।

## নিরাপত্তা ও সীমাবদ্ধতা
- Firebase Web config ব্রাউজারে দেখা যায়—এটি স্বাভাবিক। নিরাপত্তা আসে Firestore Rules থেকে, config গোপন রেখে নয়।
- Admin UID সঠিকভাবে বসানো এবং Rules publish করা জরুরি। UID ভুল হলে অ্যাডমিন লগইন হলেও গল্প প্রকাশ/ডিলিট করতে পারবে না।
- Rules-এ শুধু `published: true` গল্প সবার জন্য পড়ার অনুমতি আছে; অন্য কেউ গল্প লিখতে/ডিলিট করতে পারবে না।
- এটি static site: গল্প প্রকাশ করতে ইন্টারনেট দরকার। Feature phone/Opera Mini-তে হালকা HTML/CSS ব্যবহৃত হয়েছে, তবে খুব পুরোনো ব্রাউজারে Firebase SDK চলার নিশ্চয়তা নেই। সাধারণ button phone যদি JavaScript/HTTPS সমর্থন করে, সাধারণত সাইট খুলতে পারবে।
- `comments` ও `reactions` এই Firebase সংস্করণে এখনো যুক্ত করা হয়নি।
