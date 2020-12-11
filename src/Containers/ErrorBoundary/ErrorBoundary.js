import React, { Component } from 'react';
import ErroTemplate from './ErrorTemplate';

class ErrorBoundary extends Component {
    state = {
        hasError: false
    }

    static getDerivedStateFromError(error) {
        return {hasError: true}
    }

    componentDidCatch(error, errorInfo) {
        console.log(`The error that's encountered is: ${error}. The error is related to ${errorInfo}`);
    }

    render() {
        if(this.state.hasError) {
            return <ErroTemplate />
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
