import React from 'react';
import './ErrorPage.css';

function ErrorPage(props) {
  return (
    <div className="error-page">
      <div className="error-page__content">
        <h1 className="error-page__error-message">{props.children}</h1>
      </div>
    </div>
  );
}

export default ErrorPage;
