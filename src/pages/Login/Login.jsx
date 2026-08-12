import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

import login from "../../services/auth/LoginService";
import fdl_logo from "../../assets/img/logo/logo_fdl.png";

import "./Login.css";

gsap.registerPlugin(Draggable);

function Login() {
    const navigate = useNavigate();

    const wrapperRef = useRef(null);
    const cordBeadRef = useRef(null);
    const cordLineRef = useRef(null);
    const hitAreaRef = useRef(null);
    const draggableRef = useRef(null);
    const clickSoundRef = useRef(null);

    const [isOn, setIsOn] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        clickSoundRef.current = new Audio("https://assets.codepen.io/605876/click.mp3");

        const [instance] = Draggable.create(hitAreaRef.current, {
            type: "y",
            bounds: { minY: 0, maxY: 60 },

            onDrag() {
                gsap.set(cordBeadRef.current, { y: this.y });
                gsap.set(cordLineRef.current, { attr: { y2: 180 + this.y } });
            },

            onRelease() {
                if (this.y > 30) {
                    toggleLamp();
                }

                gsap.to([cordBeadRef.current, hitAreaRef.current], {
                    y: 0,
                    duration: 0.5,
                    ease: "back.out(2.5)",
                });

                gsap.to(cordLineRef.current, {
                    attr: { y2: 180 },
                    duration: 0.5,
                    ease: "back.out(2.5)",
                });
            },
        });

        draggableRef.current = instance;

        // Nettoyage : évite les fuites mémoire si le composant se démonte
        return () => {
            draggableRef.current?.kill();
        };
    }, []);

    const toggleLamp = () => {
        setIsOn((prev) => {
            const next = !prev;

            clickSoundRef.current?.play().catch(() => {});

            if (wrapperRef.current) {
                wrapperRef.current.setAttribute("data-on", next);
                wrapperRef.current.style.setProperty("--on", next ? 1 : 0);

                gsap.to(wrapperRef.current, {
                    backgroundColor: next ? "#1c1f24" : "#121417",
                    duration: 0.6,
                });
            }

            return next;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await login(email, password);

        setLoading(false);

        if (result.success) {
            navigate("/auteurs");
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="login-page" data-on="false" ref={wrapperRef}>
            <div className="login-container">
                {/* Lampe SVG */}
                <div className="lamp-wrapper">
                    <svg className="lamp-svg" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
                        <ellipse className="inner-glow" cx="100" cy="110" rx="60" ry="30" />
                        <rect className="lamp-base" x="92" y="100" width="16" height="160" rx="8" />
                        <rect className="lamp-base" x="60" y="250" width="80" height="12" rx="6" />

                        <g className="pull-cord">
                            <line ref={cordLineRef} className="cord-line" x1="130" y1="110" x2="130" y2="180" />
                            <circle ref={cordBeadRef} className="cord-bead" cx="130" cy="190" r="6" />
                            <circle ref={hitAreaRef} className="cord-hit" cx="130" cy="190" r="25" fill="transparent" />
                        </g>

                        <path className="lamp-shade" d="M30 110 C 30 50, 170 50, 170 110 C 170 125, 30 125, 30 110 Z" />
                    </svg>
                </div>

                {/* Formulaire */}
                <div className={`login-form ${isOn ? "active" : ""}`}>
                    <div className="login-form__logo">
                        <img src={fdl_logo} alt="FDL" />
                    </div>

                    <h2>Connexion</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="contact@fdl.mg"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Mot de passe</label>
                            <div className="login-form__password">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="login-form__eye"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.89 1 12c.73-2.06 2-3.86 3.62-5.27" />
                                            <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 8a11.83 11.83 0 0 1-4.29 5.36" />
                                            <path d="M1 1l22 22" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && <p className="login-form__error">{error}</p>}

                        <button className="login-btn" type="submit" disabled={loading}>
                            {loading ? "Connexion..." : "Se connecter"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;