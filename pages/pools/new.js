import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Button,Label,Message } from 'semantic-ui-react';
import { Form } from 'formsy-semantic-ui-react';
import cry from '../../ethereum/cry';
import web3 from '../../ethereum/web3';


const genderOptions = [
    { key: 'm', text: 'Male', value: 'male' },
    { key: 'f', text: 'Female', value: 'female' },
    { key: 'o', text: 'Other', value: 'other' },
  ];
class PoolNew extends Component {   
    state = {
        error:"",
        Index:3,
        Multiplier:1,
        Divider:1,
        Enabled:false,
        Url:""
    };

    onSubmit = async (event) => {
        try {
            const accounts = await web3.eth.getAccounts();
            console.log(accounts);
            await cry.methods
            .setPool(this.state.Index, this.state.Multiplier, this.state.Divider, this.state.Enabled, this.state.Url)
            .send({
                from: accounts[0]
            });
        } catch(err) {
            this.setState({error : err.message});
            setTimeout(() => { this.setState({ error : "" });}, 7000);
        }
    }

    render(){
        return(
            <Layout>
                <Form 
                    onValidSubmit={this.onSubmit} 
                    error={!!this.state.error}
                    ref={ ref => this.form = ref }>
                    <Form.Group widths='equal'>
                        <Form.Input 
                            name="Index"
                            label="Index"
                            readOnly
                            placeholder='Divider'
                            value={this.state.Index} /> 
                        <Form.Input 
                            name="Multiplier"
                            label="Multiplier"
                            instantValidation
                            required
                            validationErrors={{
                                isDefaultRequiredValue: 'Multiplier is Required',
                            }}
                            errorLabel={ <Label color="red" pointing/> }
                            placeholder='Multiplier' 
                            onChange={event => this.setState({ Multiplier : event.target.value })} /> 
                        <Form.Input
                            name="Divider"
                            label="Divider"
                            instantValidation
                            required
                            validationErrors={{
                                isDefaultRequiredValue: 'Divider is Required',
                            }}
                            errorLabel={ <Label color="red" pointing/> }
                            placeholder='Divider' 
                            onChange={event => this.setState({ Divider : event.target.value })} /> 
                    </Form.Group>
                    <Form.TextArea 
                        name="Url"
                        label="Url"
                        instantValidation
                        required
                        validationErrors={{
                            isDefaultRequiredValue: 'Url is Required',
                        }}
                        errorLabel={ <Label color="red" pointing/> }
                        placeholder='Url'
                        onChange={event => this.setState({ Url : event.target.value })} />
                    <Form.Checkbox 
                        name="Enabled" 
                        label='Pool Enabled'
                        onChange={event => this.setState({ Enabled : !this.state.Enabled })} />
                    <Message error header="Error!" content={this.state.error} /> 
                    <Form.Button content="Send Transactions" />
                </Form>
            </Layout>
        );
    }
}
export default PoolNew;