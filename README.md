# GrandManager

A web application that helps manage your most used links, the weather for Sarasota,FL and Thousand Oaks, CA, messaging with your family and friends, and keeping up with daily tasks on a calendar.

---

## Live Link
- https://ncfgrandma.web.app/login 


## Trailer
[![GrandManager Trailer](https://img.youtube.com/vi/G38xmqqE3mg/0.jpg)](https://www.youtube.com/watch?v=G38xmqqE3mg)


## Team Members

Ivy Bowers (PM), Annika Maringer, Angelo Morelli, Thien Ong

---

## Team Contributions
We worked together using a shared Google Doc, Trello Board, and iMessage.

![Trello Board](assets/GM_TrelloBoard.png)

### Ivy Bowers
- Client Interaction
- React Routing
- Inspirational Popups
- Chatting Feature & associated database implementation
- UML Diagram

### Annika Maringer
- Custom Buttons
- All UI
- Navbar & Footer
- App Trailer
- error 404 page

### Angelo Morelli
- Weather API for Sarasota and Thousand Oaks
- Frequently Used Links
- State Diagram

### Thien Ong
- Firebase Authentication
- Calendar config with individual users
- To-do task list with database implementation 
- Exporting Calendar for sharing
- 

---

## Features

- **Login** - Login to an account to access personal calendar and todo list for tasks.
- **SignUp** - Signup page to create an account with our page for personalized user experience
- **Authentication** - both SignUp and Login use an authentication application to verify a user
- **Not Found** -  Error codes for pages that do not exist or are wrong
- **MainRouter** - Routes/Links to other pages
- **PrivateRoute** - Private Route to a page that needs to be unlocked through a login or signup authentication
- **PDF Download** — Download list of your todo's.


---

## System:
1. **Authentication**
    - Users create an account using the SignUp page. Using google or email and password.
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


## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd GrandManager

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
### deployment
firebase login 
firebase init hosting
firebase deploy


## Project Structure

```
└───src
    ├───assets
    ├───components
    │   ├───buttons
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

## UML
![UML Component Diagram](assets/GM_UML.png)

---

## State Diagram
![State Diagram](assets/statediagram.png)

---

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [DaisyUI Documentation](https://daisyui.com/)
- [Styled Components Documentation](https://styled-components.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [@react-pdf/renderer](https://react-pdf.org/)
- [UIverse](https://uiverse.io/)
- [ReactPDF](https://react-pdf.org/) - help for the download pdf part
- [Firebase](https://firebase.google.com/)- for the authentication
- [Chat] (https://www.youtube.com/watch?v=zQyrwxMPm88)- for chat function, had to switch to live DB
