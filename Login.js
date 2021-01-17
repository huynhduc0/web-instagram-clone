import React, { useContext } from 'react';
import { firebaseAuth } from './AuthProvider';

const Login = () => {

    const { handleSignin, inputs, setInputs, errors } = useContext(firebaseAuth)

    const handleSubmit = (e) => {

        console.log(errors);
        e.preventDefault()
        console.log('handleSubmit')
        handleSignin()

    }
    const handleChange = e => {
        const { name, value } = e.target
        console.log(inputs)
        setInputs(prev => ({ ...prev, [name]: value }))
    }

    return (
        <section className="ftco-section contact-section">
            <div className="container mt-5">
                <div className="row block-9">
                    <div className="col-md-12 contact-info ftco-animate">
                        <h3 className="mb-3">Login</h3>
                        <div className="appointment-form">
                            <div className="d-md-flex">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Email"
                                        onChange={handleChange} name="email"
                                        value={inputs.email}
                                    />
                                </div>
                                <div className="form-group ml-md-4">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Pasword"
                                        onChange={handleChange}
                                        name="password"
                                        value={inputs.password}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                {errors.length > 0 ? errors.map(error => <p style={{ color: 'red' }}>{error}</p>) : null}
                            </div>
                            <div className="d-md-flex">
                                <div className="form-group">
                                    <button onClick={handleSubmit} type="button" className="btn btn-primary py-3 px-4">Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );

}
export default Login;