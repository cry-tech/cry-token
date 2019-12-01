import React , { Component } from 'react';
class MetaMaskWidget extends Component {
    state = {
        isMetaMaskInstalled:false
    }
    componentWillMount() {
        if(typeof(window) !== "undefined"){

        }
    }
    render(){
        if(typeof(window) !== "undefined" && typeof(window.ethereum) ==="undefined"){
            return(
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Metamask extension is not installed... For sending transactions need to install Metamask!</strong> <a href="https://metamask.io/"> Get Metamask </a>
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )
        }
        return null
    }
}
export default MetaMaskWidget;