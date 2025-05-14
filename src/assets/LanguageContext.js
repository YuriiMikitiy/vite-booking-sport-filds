// src/contexts/LanguageContext.js
import { createContext, useState } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('uk');

  const translations = {
    uk: {
      header: {
        home: 'Головна сторінка',
        contacts: 'Контакти',
        loginBtn: 'Увійти',
        signupBtn: 'Зареєструватися',
        logoText: 'mikitchTask',
      },
      login: {
        title: 'Увійти',
        email: 'Електронна пошта',
        password: 'Пароль',
        button: 'Увійти',
        noAccount: 'Не маєте акаунта?',
        signupLink: 'Зареєструватися',
      },
      signup: {
        title: 'Реєстрація',
        fullName: "Повне ім'я",
        email: 'Електронна пошта',
        password: 'Пароль',
        phone: 'Номер телефону',
        button: 'Створити акаунт',
        hasAccount: 'Вже маєте акаунт?',
        loginLink: 'Увійти',
      },
      common: {
        language: 'Мова',
      },
    },
    en: {
      header: {
        home: 'Home',
        contacts: 'Contacts',
        loginBtn: 'Log In',
        signupBtn: 'Sign Up',
        logoText: 'mikitchTask',
      },
      login: {
        title: 'Log In',
        email: 'Email',
        password: 'Password',
        button: 'Log In',
        noAccount: "Don't have an account?",
        signupLink: 'Sign Up',
      },
      signup: {
        title: 'Sign Up',
        fullName: 'Full Name',
        email: 'Email',
        password: 'Password',
        phone: 'Phone Number',
        button: 'Create Account',
        hasAccount: 'Already have an account?',
        loginLink: 'Log In',
      },
      common: {
        language: 'Language',
      },
    },
    fr: {
      header: {
        home: 'Accueil',
        contacts: 'Contacts',
        loginBtn: 'Connexion',
        signupBtn: 'Inscription',
        logoText: 'mikitchTask',
      },
      login: {
        title: 'Connexion',
        email: 'Email',
        password: 'Mot de passe',
        button: 'Se connecter',
        noAccount: 'Pas de compte?',
        signupLink: 'Inscription',
      },
      signup: {
        title: 'Inscription',
        fullName: 'Nom complet',
        email: 'Email',
        password: 'Mot de passe',
        phone: 'Téléphone',
        button: 'Créer un compte',
        hasAccount: 'Déjà un compte?',
        loginLink: 'Connexion',
      },
      common: {
        language: 'Langue',
      },
    },
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};