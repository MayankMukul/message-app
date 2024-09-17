import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username, email, password} =  await request.json()
        const existiongUserVerifiedByUsername = await UserModel.findOne({
            username,
            isverified: true
        })

        if(existiongUserVerifiedByUsername){
            return Response.json({
                success : false,
                message:'Username is already taken'
            },{status:404})
        }

       const existingUserByEmail = await UserModel.findOne ({email})

       const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if(existingUserByEmail){
        if(existingUserByEmail.isverified){
            return Response.json({
                success : false,
                message:'Email is already taken'
                },{status:400})
        }else{
            const hashedPassword = bcrypt.hashSync(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingUserByEmail.save()
        }
    }else{
        const hasedPassword = await bcrypt.hash(password,10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1)

        const newUser = new UserModel({
            username,
            email,
            password:hasedPassword,
            isverified:false,
            verifyCodeExpiry:expiryDate,
            isVerified:false,
            isAcceptingMessage:true,
            messages: []
        })

        await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
    )

    if(!emailResponse.success){
        return Response.json({
            success : false,
            message: emailResponse.message
    },{status:500})
    }

    return Response.json({
        success : true,
        message: 'User registered successfully. Please verify your email',
    },{status:201})

    } catch (error) {
        console.error('Error registering user', error)
        return Response.json(
            {
                success: false, 
                message : 'Error registering user'
            },
            {
                status : 500
            }
        )
    }
}