/*
 * Minio Browser (C) 2016 Minio, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'
import classNames from 'classnames'
import logo from '../../img/logo.svg'
import Alert from 'react-bootstrap/lib/Alert'

import * as actions from '../actions'

export default class Login extends React.Component {
    handleSubmit(event) {
        event.preventDefault()
        const { web, dispatch, loginRedirectPath } = this.props
        let message = ''
        if (!this.refs.secretKey.value) {
            message = 'Secret Key cannot be empty'
        }
        if (!this.refs.accessKey.value) {
            message = 'Access Key cannot be empty'
        }
        if (message) {
            dispatch(actions.showAlert({
                type: 'danger',
                message
            }))
            return
        }
        web.Login({username: this.refs.accessKey.value, password: this.refs.secretKey.value})
            .then((res) => {
                this.context.router.push(loginRedirectPath)
            })
            .catch(e => {
                dispatch(actions.setLoginError())
                dispatch(actions.showAlert({
                    type: 'danger',
                    message: e.message
                }))
            })
    }

    componentWillMount() {
        const { dispatch } = this.props
        // Clear out any stale message in the alert of previous page
        dispatch(actions.showAlert({type: 'danger', message: ''}))
        document.body.classList.add('is-guest')
    }

    componentWillUnmount() {
        document.body.classList.remove('is-guest')
    }

    hideAlert() {
        const { dispatch } = this.props
        dispatch(actions.hideAlert())
    }

    render() {
        const { alert } = this.props
        let alertBox = <Alert className={'alert animated ' + (alert.show ? 'fadeInDown' : 'fadeOutUp')} bsStyle={alert.type}
                              onDismiss={this.hideAlert.bind(this)}>
            <div className='text-center'>{alert.message}</div>
        </Alert>
        // Make sure you don't show a fading out alert box on the initial web-page load.
        if (!alert.message) alertBox = ''
        return (
            <div className="login">
                {alertBox}
                <div className="l-wrap">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <input ref="" name="fixBrowser" autoComplete="username" type="text" style={{display: 'none'}}/>
                        <div className='lc-item'>
                            <input ref="accessKey" name="username" className="lci-text" type="text" spellCheck="false" required="required" autoComplete="username"/>
                            <label className="lci-label">Access Key</label>
                            <div className="lci-helpers">
                                <i></i><i></i>
                            </div>
                        </div>
                        <div className='lc-item'>
                            <input ref="" type="text" autoComplete="new-password" style={{ display: 'none' }}/>
                            <input ref="secretKey" name="password" className="lci-text" type="password" spellCheck="false" required="required" autoComplete="new-password"/>
                            <label className="lci-label">Secret Key</label>
                            <div className="lci-helpers">
                                <i></i><i></i>
                            </div>
                        </div>
                        <div className="lc-item">
                            <button className="lci-login" type="submit">
                                <i className="fa fa-sign-in"></i>
                            </button>
                        </div>
                    </form>
                </div>

                <div className="l-footer">
                    <a className="lf-logo" href="">
                        <img src={logo} alt=""/>
                    </a>

                    <div className="lf-server">
                        {window.location.host}
                    </div>
                </div>
            </div>
        )
    }
}

Login.contextTypes = {
    router: React.PropTypes.object.isRequired
}
