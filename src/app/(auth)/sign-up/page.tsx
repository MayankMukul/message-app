'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from "@/hooks/use-toast"
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function page() {
  const [username, setUsername] = useState("");
  const [ usernameMessage, setUsernameMessage] = useState('');
  const [ isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [ isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300)
  const {toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues:{
      username: '',
      email: '',
      password: '',
    }
  })

  useEffect(()=>{
    const checkUsernameUnique = async ()=>{
      if(username){
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data.message)
        } catch (error) {
          console.log("Error", error);
        }finally{
          setIsCheckingUsername(false);
        }
      }
    }
    checkUsernameUnique();
  },[username])

  const onSubmit = async(data: z.infer<typeof signUpSchema>)=>{
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast({
        title:'Success',
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
      setIsSubmitting(false);
    } catch (error) {
      console.log('error in signup',error);
      setIsSubmitting(false);

    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign Up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field}
                onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                }} />
              </FormControl>
              {isCheckingUsername && <>Loading..
              <p className={`text-sm ${usernameMessage === "Username is unique"? 'text-green-500':'text-red-500'}`}>test {usernameMessage}</p>
              </>}
              
              <FormMessage />
            </FormItem>
            )}
            />

<FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field}
                 />
              </FormControl>
              
              <FormMessage />
            </FormItem>
            )}
            />

<FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field}
                 />
              </FormControl>
              
              <FormMessage />
            </FormItem>
            )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                  Submitting Please Wait...
                  </>
                ): ('Submit')
              }
            </Button>
    
          </form>
        </Form>
      </div>
    </div>
  )
}
