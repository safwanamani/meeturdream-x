import React from 'react';
import { useParams } from 'react-router-dom';

function ApplePay() {
    let { file } = useParams()
    file = "apple-developer-merchantid-domain-association"

    return window.open(`/.well-known/apple-developer-merchantid-domain-association`)
}

export default ApplePay;