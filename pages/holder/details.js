import React, { Component } from 'react';
import Layout from '../../components/Layout';
import cry from '../../ethereum/cry';
import { Link, } from '../../routes';

class HolderDetails extends Component {
    static async getInitialProps(props) {
        try{
            const balance = await cry.methods.balanceOf(props.query.address).call();
            return { address:props.query.address, balance:balance, error:null }
        }
        catch(e) {
            return { address:null, balance:null, error: e }
        }

    }
    renderdetails(){
        if(this.props.error){
            console.log(this.props.error);
            return(
                <div className="col">
                    <div className="alert alert-danger" role="alert">
                        <h4 class="alert-heading">Oops!</h4>
                        <p>{ this.props.error.reason }</p>
                        <hr />
                        <p class="mb-0">Check your address</p>
                    </div>
                </div>
               
            );
        }
        else{
            return(
                <div className="col">
                    <h2 class="alert-heading main-color page-title">Wallet Info</h2>
                    <h5 style={{ wordBreak: "break-word" }}>{ this.props.address }</h5>
                    { this.renderInfo()}
                </div>
            );
        }
    }
    render() {
        return(
            <Layout>
                <div className="row mt-3">
                    { this.renderdetails() }
                </div>
                <div className="row">
                    <div className="col">
                    < hr/>
                    <h4 class="alert-heading main-color">Payment History</h4>
                        { this.renderPaymentHistory() }
                    </div>
                </div>
            </Layout>
        );
    }

    renderInfo(){
        return(         
            <div className="row mt-4">
                    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                        <div className="card holder-cart">
                            <div className="row no-gutters my-auto">
                                <div className="col-md-5 text-center my-auto">
                                    <i className="fas fa-dollar-sign holder-d-icon"></i>
                                </div>
                                <div className="col-md-7">
                                    <div className="card-body text-center ">
                                        <h5 className="card-title">Balance</h5>
                                        <p className="card-text">{ this.props.balance/10000 } CRY</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                        <div className="card holder-cart">
                            <div className="row no-gutters my-auto">
                                <div className="col-md-5 text-center my-auto">
                                    <i className="fas fa-chart-line holder-d-icon"></i>
                                </div>
                                <div className="col-md-7">
                                    <div className="card-body text-center ">
                                        <h5 className="card-title">Monthly Profit</h5>
                                        <p className="card-text">0.0045 $</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                        <div className="card holder-cart">
                            <div className="row no-gutters my-auto">
                                <div className="col-md-5 text-center my-auto">
                                    <i className="fas fa-money-check-alt holder-d-icon"></i>
                                </div>
                                <div className="col-md-7">
                                    <div className="card-body text-center ">
                                        <h5 className="card-title">Unpaid Profit</h5>
                                        <p className="card-text">20 ETH</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                        <div className="card holder-cart">
                            <div className="row no-gutters my-auto">
                                <div className="col-md-5 text-center my-auto">
                                    <i className="fab fa-ethereum holder-d-icon"></i>
                                </div>
                                <div className="col-md-7">
                                    <div className="card-body text-center">
                                        <h5 className="card-title">Next Payment</h5>
                                        <p className="card-text">2019/01/10</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }

    renderPaymentHistory(){
        let x = [1,2,3,4]
        const items = x.map(item => {
            return {
                id:item,
                date: new Date().toLocaleDateString(),
                description : <a>View details</a>,
                amount: "12 eth"
            };
        });
        return(
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>more</th>
                    </tr>
                </thead>

                <tbody>
                { items.map((item,i) => {
                    return(
                        <tr key={i}>
                            <td>{item.id}</td>
                            <td>{item.date}</td>
                            <td>{item.amount}</td>
                            <td><Link route= {`/payment/${item.id}`} ><a>View details</a></Link></td>
                        </tr>
                    );
                })}    
                </tbody>
            </table>
        )
    }

}

export default HolderDetails;   