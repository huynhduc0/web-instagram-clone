import React, { useContext } from 'react';
import { firebaseAuth } from './AuthProvider';
import { withRouter } from 'react-router';

const Register = (props) => {



    const { handleSignup, inputs, setInputs, errors } = useContext(firebaseAuth)

    const handleSubmit = async (e) => {
        console.log(errors);


        await handleSignup()
        //push home
        // props.history.push('/')
        console.log('handleSubmit')
    }
    const handleChange = e => {
        const { name, value } = e.target
        // console.log(inputs)
        setInputs(prev => ({ ...prev, [name]: value }))
    }

    return (
        <section className="ftco-section contact-section">
            <div className="container mt-5">
                <div className="row block-9">
                    <div className="col-md-4 contact-info ftco-animate">
                        <div className="row">
                            <div className="col-md-12 mb-4">
                                <h2 className="h4">Register</h2>
                            </div>
                            <div className="col-md-12 mb-3">
                                <p><span>Address:</span> 198 West 21th Street, Suite 721 New York NY 10016</p>
                            </div>
                            <div className="col-md-12 mb-3">
                                <p><span>Phone:</span> <a href="tel://1234567920">+ 1235 2355 98</a></p>
                            </div>
                            <div className="col-md-12 mb-3">
                                <p><span>Email:</span> <a href="/cdn-cgi/l/email-protection#d2bbbcb4bd92abbda7a0a1bba6b7fcb1bdbf"><span className="__cf_email__" data-cfemail="cda4a3aba28db4a2b8bfbea4b9a8e3aea2a0">[email&nbsp;protected]</span></a></p>
                            </div>
                            <div className="col-md-12 mb-3">
                                <p><span>Website:</span> <a href="#">yoursite.com</a></p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-1" />
                    <div className="col-md-6 ftco-animate">
                        <div className="contact-form" >
                            <div className="form-group">
                                <input type="text" onChange={handleChange} name="email" value={inputs.email} className="form-control" placeholder="Email" />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-control" onChange={handleChange} name="password" value={inputs.password} placeholder="Password" />
                            </div>
                            <div className="form-group">
                                {errors.length > 0 ? errors.map(error => <p style={{ color: 'red', display: 'block' }}>{error}</p>) : null}
                            </div>

                            <div className="form-group">
                                <button onClick={handleSubmit} type="button" className="btn btn-primary py-3 px-5" >Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
    // 
}
export default withRouter(Register);