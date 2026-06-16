### Hexlet tests and linter status:
[![Actions Status](https://github.com/Mikhail-o0/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Mikhail-o0/frontend-project-12/actions)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://hexlet-chat-7d9b.onrender.com)

# 🚀 Hexlet Chat

[![Hexlet Chat](https://github.com/Mikhail-o0/frontend-project-12/actions/workflows/main.yml/badge.svg)](https://github.com/Mikhail-o0/frontend-project-12/actions)
[![Deploy to Render](https://img.shields.io/badge/deploy-render-purple)](https://frontend-project-12-xxxx.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)

> Полнофункциональный чат в стиле Slack с поддержкой real-time сообщений, каналов и авторизации.

![Chat Preview](https://github.com/Mikhail-o0/frontend-project-12/raw/main/docs/preview.png)

---

## 📋 Содержание

- [О проекте](#-о-проекте)
- [Возможности](#-возможности)
- [Технологии](#-технологии)
- [Демо](#-демо)
- [Установка и запуск](#-установка-и-запуск)
- [Структура проекта](#-структура-проекта)
- [Скриншоты](#-скриншоты)
- [Roadmap](#-roadmap)
- [Автор](#-автор)

---

## 📖 О проекте

**Hexlet Chat** — это финальный проект курса [JavaScript Frontend](https://ru.hexlet.io/courses/js-frontend) от Hexlet. Приложение представляет собой real-time чат с поддержкой множественных каналов, авторизацией пользователей и модерацией контента.

Проект разработан с использованием современного стека технологий и лучших практик frontend-разработки.

---

## ✨ Возможности

### 🔐 Авторизация и регистрация
- ✅ Регистрация новых пользователей с валидацией
- ✅ Вход в систему с JWT-токенами
- ✅ Автоматический редирект для неавторизованных пользователей
- ✅ Выход из системы

### 💬 Чат в реальном времени
- ✅ Мгновенная доставка сообщений через WebSocket
- ✅ Автоматическая прокрутка к новым сообщениям
- ✅ Индикатор состояния подключения
- ✅ Фильтрация сообщений по каналам

### 📺 Управление каналами
- ✅ Создание новых каналов
- ✅ Переименование каналов
- ✅ Удаление каналов с подтверждением
- ✅ Автоматический выбор канала "General" по умолчанию
- ✅ Выпадающее меню с действиями

### 🛡️ Модерация
- ✅ Фильтрация нецензурной лексики (leo-profanity)
- ✅ Валидация названий каналов и сообщений

### 🌍 Интернационализация
- ✅ Поддержка русского и английского языков
- ✅ Все тексты вынесены в файлы переводов
- ✅ Дефолтная локаль: `ru`

### 🎨 UX/UI
- ✅ Всплывающие уведомления (react-toastify)
- ✅ Адаптивная вёрстка (Bootstrap 5)
- ✅ Модальные окна с автофокусом
- ✅ Блокировка кнопок во время запросов

---

## 🛠 Технологии

### Frontend
- **React 18** — библиотека для создания пользовательских интерфейсов
- **Redux Toolkit** — управление состоянием приложения
- **RTK Query** — работа с REST API
- **Socket.io-client** — WebSocket соединения
- **React Router v6** — маршрутизация
- **Formik + Yup** — формы и валидация
- **i18next** — интернационализация
- **react-toastify** — уведомления
- **Bootstrap 5** — стилизация
- **Vite** — сборщик

### Backend
- **@hexlet/chat-server** — серверная часть чата
- **Express** — веб-фреймворк
- **Socket.io** — WebSocket сервер
- **JWT** — аутентификация

### Инструменты
- **Git** — система контроля версий
- **Render** — деплой
- **Make** — автоматизация задач

---

## 🌐 Демо

🔗 **Live Demo:** [https://frontend-project-12-xxxx.onrender.com](https://frontend-project-12-xxxx.onrender.com)

**Тестовый аккаунт:**
- Логин: `admin`
- Пароль: `admin`

---

## 🚀 Установка и запуск

### Требования
- Node.js 18+
- npm 8+
- Git

### Локальный запуск

```bash
# Клонировать репозиторий
git clone https://github.com/Mikhail-o0/frontend-project-12.git
cd frontend-project-12

# Установить зависимости
make install

# Запустить сервер
make start