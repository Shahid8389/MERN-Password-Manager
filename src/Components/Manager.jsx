import React, { useEffect, useRef, useState } from 'react'


const Manager = () => {
    const [form, setform] = useState({ website: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

    const passwordRef = useRef();


    const getPasswords = async () => {
        let req = await fetch(`${import.meta.env.VITE_PORT}`)
        let passwords = await req.json()

        setPasswordArray(passwords)

    }

    useEffect(() => {
        getPasswords();
    }, [])


    const copyText = (text) => {
        navigator.clipboard.writeText(text)
    }

    const showPassword = (e) => {
        if (e.target.classList.contains('bi') && e.target.classList.contains('bi-eye-slash')) {
            e.target.classList.remove('bi-eye-slash');
            e.target.classList.add('bi-eye');

            passwordRef.current.type = "text";
        }
        else {
            e.target.classList.remove('bi-eye');
            e.target.classList.add('bi-eye-slash');

            passwordRef.current.type = "password";
        }

    }

    const savePassword = async () => {

        if (form.website.length > 3 && form.username.length >= 1 && form.password.length >= 1) {

            await fetch(`${import.meta.env.VITE_PORT}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form }) })

            setform({ website: "", username: "", password: "" })
        }

        getPasswords();
    }

    const handleChange = (e) => {

        setform({ ...form, [e.target.name]: e.target.value })

    }

    const editPassword = async (id) => {
        console.log(id);

        setform(passwordArray.filter(item => item._id === id)[0])
        // setform({...passwordArray.filter(item => item._id === id)[0], id: id})

        await fetch(`${import.meta.env.VITE_PORT}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })

        getPasswords();
    }

    const deletePassword = async (id) => {

        await fetch(`${import.meta.env.VITE_PORT}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })

        getPasswords();
    }


    return (
        <div className='lg:mx-[12rem] md:mx-[5rem] mx-[0.5rem] md:text-[1.1rem] text-[1rem] '>

            <div className='flex justify-center items-center flex-col'>
                <h2 className='text-3xl mt-6 text-blue-700 font-bold italic '>Pass-Manager</h2>
                <p>Save your Passwords.</p>
            </div>

            <div className='mx-4 mt-10'>
                <input value={form.website} onChange={(e) => { handleChange(e) }} className='border-2 border-black w-full p-1.5 rounded-xl' type="text" name='website' placeholder='URL:' />


                <div className='my-5 flex md:flex-row gap-5 flex-col relative'>
                    <input value={form.username} onChange={(e) => { handleChange(e) }} type="text" className='border-2 border-black rounded-xl w-full p-1.5' name='username' placeholder='Username:' />

                    <input ref={passwordRef} value={form.password} onChange={(e) => { handleChange(e) }} type="password" className='border-2 border-black rounded-xl p-1.5 relative' name='password' placeholder='Password:' />
                    <i onClick={(e) => { showPassword(e) }} className="bi bi-eye-slash absolute right-[1rem] top-[4.1rem] md:right-2 md:top-[0.45rem] cursor-pointer"></i>
                </div>
            </div>

            <div className='flex justify-center'>
                <button onClick={() => { savePassword() }} className='bg-blue-600 text-white py-1 px-2 text-lg rounded-lg w-28 md:w-[9rem] h-11 md:h-[3rem] md:text-[1.5rem] '>Save<i className="bi bi-clipboard2-check ml-1"></i></button>
            </div>

            <div className='mt-8'>
                <h2 className='text-lg md:text-[1.2rem] pb-3'>Your Saved Passwords.</h2>

                {/* Implement no password scenario. */}
                {passwordArray.length === 0 && <p className='text-lg md:text-[1.2rem]'>No Passwords To Show!</p>}
                {passwordArray.length !== 0 &&
                    <table className="table-auto w-full rounded-md overflow-hidden border-separate border-spacing-y-0.5">
                        <thead>
                            <tr className='bg-blue-400'>
                                <th>Website URL</th>
                                <th>Username</th>
                                <th>Password</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody className='text-center bg-blue-200'>
                            {/* map function implement and show the details of user inputs */}
                            {passwordArray.map((item, index) => {
                                return (
                                    <tr key={index} className='mt-[20rem]'>
                                        <td className='px-1 py-0.5'>{item.website}<i onClick={()=>{copyText(item.website)}} className="bi bi-copy pl-1 text-sm cursor-pointer"></i></td>
                                        <td className='px-1 py-0.5'>{item.username}<i onClick={()=>{copyText(item.username)}} className="bi bi-copy pl-1 text-sm cursor-pointer"></i></td>
                                        <td className='px-1 py-0.5'>{item.password}<i onClick={()=>{copyText(item.password)}} className="bi bi-copy pl-1 text-sm cursor-pointer"></i></td>
                                        <td className='px-1 py-0.5'><i onClick={() => { editPassword(item._id) }} className="bi bi-pencil-square text-lg cursor-pointer"></i><i onClick={() => { deletePassword(item._id) }} className="bi bi-trash3 pl-3 text-lg cursor-pointer"></i></td>
                                    </tr>
                                )
                            })}

                        </tbody>

                    </table>
                }
            </div>

        </div>
    )
}

export default Manager