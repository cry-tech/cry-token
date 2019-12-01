import React, { Component } from 'react';
import Layout from '../../components/Layout';
import MetaMaskWidget from '../../components/MetaMaskWidget';
import { Label, Message } from 'semantic-ui-react';
import { Form } from 'formsy-semantic-ui-react';
import cry from '../../ethereum/cry';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';

class Buy extends Component {   
    state = {
        error:"",
        Amount:0,
        bonusToken:0,
        etherToPay:0,
        loading: false,
        btnSendDisabled: true
    };
    
    componentDidMount(){
        if(typeof(window) !== "undefined" && typeof(window.ethereum) !== "undefined" && ethereum.isMetaMask){
            this.setState({ btnSendDisabled : false });
        }
    }

    static async getInitialProps() {
        const tokenPrice = await cry.methods.tokenPrice().call();
        const ETHUSD = await cry.methods.ETHUSD().call();
        const startDate = await cry.methods.startDate().call() * 1000;
        const endDate = await cry.methods.endDate().call() * 1000;
        const bonus = await cry.methods.bonus().call();
        const bonusEnds = await cry.methods.bonusEnds().call() * 1000;
        return { tokenPrice, ETHUSD, startDate, endDate, bonus, bonusEnds };
    }

    onSubmit = async (event) => {
        if(typeof(window) !== "undefined" && typeof(window.ethereum) === "undefined"){
            
        }
        else {

            this.setState({ loading:true, error:"" });
            try {
                await ethereum.enable();
                const accounts = await web3.eth.getAccounts();
                const amountToSend = web3.utils.toWei(this.state.etherToPay.toString(), "ether"); //convert to wei value
                await web3.eth
                .sendTransaction({
                    from:accounts[0],
                    to:cry.options.address, 
                    value:amountToSend});
                Router.pushRoute('/');
            } catch(err) {
                this.setState({error : err.message});
                setTimeout(() => { this.setState({ error : "" });}, 7000);
            }
            this.setState({ loading:false });
        }      
    }

    onChangeAmount(event) {
        var currentDate = + new Date();
        if(this.props.bonusEnds <= currentDate){
            this.setState({ 
                bonusToken: (event.target.value * this.props.bonus) / 100,
                Amount : event.target.value,
                etherToPay: event.target.value * (this.props.tokenPrice / this.props.ETHUSD) * 10000
            });
        }
        else {
            this.setState({ 
                bonusToken: 0,
                Amount : event.target.value,
                etherToPay: event.target.value * (this.props.tokenPrice / this.props.ETHUSD) * 10000
            });
        }
    }

    render(){
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return(
            <Layout>
                <h2 class="alert-heading main-color page-title">Buy Cry Token</h2>
                <div className="row">
                    <div className="col-sm-6">
                        <ul className="list-group">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Current CRY token price
                                <span className="badge badge-primary badge-pill">{ this.props.tokenPrice / 10000} USD</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Current ETH price
                                <span className="badge badge-primary badge-pill">{ this.props.ETHUSD/100000000 } USD</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                ICO Started At
                                <span className="badge badge-primary badge-pill">{ new Date(this.props.startDate).toLocaleDateString("en-US",options) }</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                ICO Ended At
                                <span className="badge badge-primary badge-pill">{ new Date(this.props.endDate).toLocaleDateString("en-US",options) }</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Bonus
                                <span className="badge badge-primary badge-pill">{ this.props.bonus }% more token</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Bonus Ended At
                                <span className="badge badge-primary badge-pill">{ new Date(this.props.bonusEnds).toLocaleDateString("en-US",options) }</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                ICO Started At
                                <span className="badge badge-primary badge-pill">{ new Date(this.props.startDate).toLocaleDateString("en-US",options) }</span>
                            </li>
                        </ul>
                    </div>
                    <div className="col-sm-6">
                        <MetaMaskWidget />
                        <Form 
                            onValidSubmit={this.onSubmit} 
                            error={!!this.state.error}
                            ref={ ref => this.form = ref }>
                            
                            <Form.Input 
                                name="Amount"
                                label="Amount"
                                instantValidation
                                required
                                validationErrors={{
                                    isDefaultRequiredValue: 'Amount is Required',
                                }}
                                errorLabel={ <Label color="red" pointing/> }
                                placeholder='Amount' 
                                onChange={ (event) => this.onChangeAmount(event) } /> 
                            <Message error content={this.state.error} /> 
                            <p>You Pay { this.state.etherToPay } Ether</p> 
                            <p>and you give { this.state.bonusToken} extra bonus token</p> 
                            <Form.Button disabled={ this.state.btnSendDisabled } loading={ this.state.loading } content="Send Transactions" />
                        </Form>
                    </div>
                </div>
            </Layout>
        );
    }
}
export default Buy;