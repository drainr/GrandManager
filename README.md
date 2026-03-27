# GrandManager

A web application that helps managing your most used links, the weather you want to know, the messages with your family and friends and your to do's.

---

## Live Link
- 


## Team Members

- Angelo
- Thien
- Ivy Bowers
- Annika Maringer

---

## Features

- **PDF Download** — Download list of your todo's.
- **Login** - Login to an account to save movies in a wishlist or watchlist
- **SignUp** - Signup page to create an account with our page for personalized user experience
- **Authentication** - both SignUp and Login use an authentication application to verify a user
- **Not Found** -  Error codes for pages that do not exist or are wrong
- **MainRouter** - Routes/Links to other pages
- **PrivateRoute** - Private Route to a page that needs to be unlocked through a login or signup authentication
-

---

## System:
1. **Authentication**
    - Users create an account using the SignUp page.
    - Firebase Authentication validates user credentials.
    - After login, users can access protected routes like the Dashboard.


4. **Navigation System**
    - React Router manages page navigation.
    - If the user clicks **Login**, they are navigated to the **Login page**.
    - If the user clicks **Sign Up**, they are navigated to the **SignUp page**.
    - After successful authentication, the user is redirected to the **Dashboard**.
    - If user clicks **log out**, the user is redirected to the **Login page**.
    - If a user attempts to access a 'protected' page, they are redirected to the **Unauthorized page**.
    - without being logged in the features adding to watched and wishlist are disabled.
    - If the user enters a route (about us page) that does not exist, the **NotFound page** is displayed.

## How It Works

1. On Load the User gets send to the Home Page that shows the top rated movies and asks the User to Login or create an account to be able to save movies in watchlist or wishlist
2. Login/SignUp requires the User to either fill out your data to create and account or if an account already exists to use the correct email and password to get access to your profile
4. On load, the app fetches movie data from `/public/movie.json`.
2. The `SearchBar` component provides a text input and four dropdowns (genre, age group, year, sort order).
3. Filtering and sorting are computed with `useMemo` so the UI stays responsive.
4. Each `MovieCard` shows the movie poster as a background image with a gradient overlay. Hovering reveals the short description, runtime, and budget.
5. Clicking the heart button toggles a movie in the **Watchlist**; clicking the eye button toggles it in **Already Watched**.
6. Both lists are accessible via the icons in the **Navbar**. Each opens a side drawer listing the saved movies with a Remove button and a Download List button.
7. The Download button uses `@react-pdf/renderer` to generate and download a PDF with the movie title, year, genre, IMDB rating, and runtime for each entry.
8. There are pages like about and watch that are unauthorized for the user or are not available which show an error code
---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mini-project-05

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
└───src
    ├───assets
    ├───components
    │   ├───buttons
    │   ├───firebase
    │   ├───list
    │   ├───routes
    │   ├───weather
    │   └───weblist
    ├───firebase
    ├───hooks
    ├───layout
    ├───pages
    └───routes
```

---

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [DaisyUI Documentation](https://daisyui.com/)
- [Styled Components Documentation](https://styled-components.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)
- [@react-pdf/renderer](https://react-pdf.org/)
- [Claude by Anthropic](https://claude.ai) — used to assist with Git and GitHub workflows
- [UIverse](https://uiverse.io/LightAndy1/tidy-pig-67)
- [UIverse](https://uiverse.io/Uncannypotato69/ancient-hound-67)
- [ReactPDF](https://react-pdf.org/) - help for the download pdf part
- [Firebase](https://firebase.google.com/)- for the authentication
