import React, { Component } from 'react';
import cry from '../ethereum/cry';
import {Card,Button,Table} from 'semantic-ui-react';
import  Layout from '../components/Layout';
import { Form, Grid,Header } from 'semantic-ui-react'
import { Link, Router } from '../routes';

class CryIndex extends Component{
    state = {
        searchAddress:""
    }
    static async getInitialProps() {
        const holders = await cry.methods.getHolders().call();
        return { holders };
    }

    onSubmit(e) {
        e.preventDefault();
        Router.pushRoute(`/holder/${this.state.searchAddress}`);
    }
    
    render(){
        return(
        <Layout>
            <div className="row">
                <div className="col">
                    <div className="searchBox p-3">
                        <p className='h5 text-white'>
                            Enter Wallet Address
                        </p>
                        <form onSubmit={ (e) => this.onSubmit(e) }>
                            <div className="form-row">
                                <div className="col-sm-10">
                                    <input type="text" onChange={(e)=>{ this.setState({ searchAddress:e.target.value }); }} className="form-control mt-2" id="search" placeholder="Wallet Address" />
                                </div>
                                <div className="col-sm-2">
                                    <button type="submit" className="btn btn-primary w-100 mt-2">Search</button>
                                </div>
                            </div>
                        </form>   
                    </div>
                </div>
            </div>
            {this.renderInfo()}< hr/>
            <div className="row">
                
                <div className="col">
                    <h4 class="alert-heading main-color">Latest Payout</h4>
                    { this.renderLatestHolders() }
                </div>
                <div className="col">
                    <h4 class="alert-heading main-color">Holder List</h4>
                    { this.renderLatestHolders() }
                </div>
            </div>
        </Layout>    
       );
    }

    renderLatestHolders(){
        const items = this.props.holders.map(address => {
            return {
                header: address,
                description : <a>View details</a>,
                fluid: true
            };
        });
        return(
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Wallet</th>
                        <th>Operation</th>
                    </tr>
                </thead>

                <tbody>
                { items.map((item,i) => {
                    return(
                        <tr key={i}>
                            <td>{item.header}</td>
                            <td><Link route= {`/holder/${item.header}`} ><a>View details</a></Link></td>
                        </tr>
                    );
                })}    
                </tbody>
            </table>
        )
    }

    renderInfo(){
        return(
            <div>                
                <div className="row mt-4">
                    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                        <div className="card holder-cart">
                            <div className="row no-gutters my-auto">
                                <div className="col-md-5 text-center my-auto">
                                    <i className="fas fa-chart-bar holder-d-icon"></i>
                                </div>
                                <div className="col-md-7">
                                    <div className="card-body text-center">
                                        <h5 className="card-title">Farms Hashrate</h5>
                                        <p className="card-text">500 Th</p>
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
                                        <h5 className="card-title">Token Price</h5>
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
                                    <i className="fas fa-balance-scale holder-d-icon"></i>
                                </div>
                                <div className="col-md-7">
                                    <div className="card-body text-center">
                                        <h5 className="card-title">1 Cry</h5>
                                        <p className="card-text">1.1 Ghash</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                        <div className="card holder-cart">
                            <div className="row no-gutters my-auto">
                                <div className="col-md-5 text-center my-auto">
                                    <i className="fas fa-dollar-sign holder-d-icon"></i>
                                </div>
                                <div className="col-md-7">
                                    <div className="card-body text-center">
                                        <h5 className="card-title">Monthly Profit</h5>
                                        <p className="card-text">500 Th</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CryIndex;   