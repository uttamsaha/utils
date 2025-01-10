"use client"
import { useState, useRef, useEffect, Suspense } from 'react';
import LoginRegisterLayout from "../../../components/layout/LoginRegisterLayout";
import { ButtonLoader } from '@/assets/icons';
import { submitFormData } from '@/utils/CustomFetcher';
import endpoint from '@/utils/endpoint';
import { showErrorMsg } from '@/utils/showErrorMsg';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';

const EmailVerificationComponent = () => {
    const searchParams = useSearchParams();
    const emailQuery = searchParams.get("email");
    const otpQuery = searchParams.get("otp");

    const userInfo = JSON.parse(typeof window !== "undefined" ? window.localStorage.getItem('user_auth_info') : false);
    const [codes, setCodes] = useState(Array(6).fill(''));
    const refs = useRef([]);
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (otpQuery) {
            const otpArray = otpQuery.split('');
            setCodes(otpArray);
            refs.current[otpArray.length - 1]?.focus();
        } else {
            refs.current[0]?.focus();
        }
    }, [otpQuery]);

    useEffect(() => {
        if (codes.every(code => code !== '')) {
            handleSubmit();
        }
    }, [codes]);

    const handleChange = (index, value) => {
        if (/^\d*$/.test(value)) {
            const newCodes = [...codes];
            newCodes[index] = value;
            setCodes(newCodes);

            if (value.length === 1 && index < 5) {
                refs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && codes[index] === '') {
            if (index > 0) {
                refs.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pasteData = event.clipboardData.getData('text');
        if (/^\d{6}$/.test(pasteData)) {
            const newCodes = pasteData.split('');
            setCodes(newCodes);
            refs.current[newCodes.length - 1]?.focus();
        }
    };

    const handleSubmit = async (event) => {
        if (event) {
            event.preventDefault();
        }
        const codeString = codes.join('');
        console.log("Submitted Code:", codeString);
        if (codeString) {
            setLoader(true);

            const postData = {
                email: emailQuery ? emailQuery : userInfo?.email,
                otp: otpQuery ? otpQuery : codeString,
            }
            const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint.authentication.email_verify}`;

            try {
                const data = await submitFormData(apiUrl, postData);
                const errorResponse = data?.response?.data?.message;
                if (data?.data?.success) {
                    toast.success(data?.data?.resource?.message);
                    router.push('/signin');
                }
                if (errorResponse) {
                    showErrorMsg(errorResponse);
                }
            } catch (error) {
                toast.error("Something wen't wrong!");
            } finally {
                setLoader(false);
            }
        }
    };

    const isButtonDisabled = codes.some(code => code === '');

    const maskEmail = (email) => {
        if (email) {
            const [name, domain] = email.split('@');
            const maskedName = name.slice(0, 2) + '*****' + name.slice(-1);
            return `${maskedName}@${domain}`;
        }
    };

    return (
        <LoginRegisterLayout>
            <div className="flex flex-col gap-[8px] sm:mt-[48px] mt-[20px] sm:mb-[48px] px-[6px] mb-[20px]">
                <div className="sm:w-[858px] w-full py-16 px-10 flex flex-col items-center justify-center bg-white mx-auto sm:px-0 rounded-[4px]">
                    <div className="title flex items-center justify-center flex-col mb-5">
                        <h3 className='font-semibold text-ribonBlue text-[18px] '>ENTER OTP TO VERIFICATION</h3>
                        <p className="info font-medium text-primary">
                            {`An OTP has been sent to ${emailQuery ? maskEmail(emailQuery) : maskEmail(userInfo?.email)}`}
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col items-center">
                        <div className="flex gap-[8px] mb-[16px]">
                            {codes.map((code, index) => (
                                <input
                                    key={index}
                                    ref={el => refs.current[index] = el}
                                    type="text"
                                    maxLength={1}
                                    value={code}
                                    onChange={e => handleChange(index, e.target.value)}
                                    onKeyDown={e => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : null}
                                    style={{ width: '35px', height: '35px', textAlign: 'center', fontSize: '18px' }}
                                    className="border border-secondary border-opacity-30 duration-300 rounded-[4px] text-primary font-medium p-[4px]"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                />
                            ))}
                        </div>
                        <button
                            type="submit"
                            className={`bg-ribonBlue ${isButtonDisabled && "opacity-70"} flex items-center justify-center text-[14px] font-medium text-white px-[15px] py-[6px] rounded-[4px] ${!isButtonDisabled && "hover:bg-hoverRibonBlue"} focus:outline-none ${loader && 'pointer-events-none'}`}
                            disabled={isButtonDisabled}
                        >
                            {
                                loader ? (
                                    <>
                                        <ButtonLoader />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify Your Otp"
                                )
                            }

                        </button>
                    </form>
                </div>
            </div>
        </LoginRegisterLayout>
    );
};

const EmailVerification = () => {
    return (
        <Suspense>
            <EmailVerificationComponent />
        </Suspense>
    )
}
export default EmailVerification;
