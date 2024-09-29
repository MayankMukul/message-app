import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from 'next-auth';

export async function POST(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "You must be logged in to perform this action",
            },{ status : 401}
        )
    }

    const userId = user._id;
    const {acceptmessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessage: acceptmessages
        },{new:true})

        if(!updatedUser){
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user settings",
                    },{ status : 401}
                    )
        }

        return Response.json({
            success: true,
            message: "User settings updated successfully",
            updatedUser,
            },{ status : 200})
            
        
    } catch (error) {
        console.log('failde to update user status to accept messages')
        return Response.json(
            {
                success: false,
                message: "Failed to update user settings",
                },{ 
                    status : 401

                })

    }
}

export async function GET(request:Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: "You must be logged in to perform this action",
            },{ status : 401}
        )
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)
            if (!foundUser) {
              return Response.json(
                {
                  success: false,
                  message: "User Not Found",
                },
                { status: 404 }
              );
            }
    
            return Response.json(
                {
                  success: true,
                  isAcceptingMessages: foundUser.isAcceptingMessage
                },
                { status: 200 }
              );
    } catch (error) {
        console.log('failde to update user status to accept messages')
        return Response.json(
            {
                success: false,
                message: "Error is getting message acceptance status",
                },{ 
                    status : 500

                })
    }
}