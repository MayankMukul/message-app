import {Html, Head, Font, Preview, Heading, Row, Section, Text} from '@react-email/components';

interface VerificationEmailProps{
    username: string;
    otp: string;
}

export default function VerificationEmail({username, otp}
    : VerificationEmailProps) {
        return (
            <Html>
            <Head>
                <title>Verification Code</title>
            </Head>
            <Preview>Here &apos;s your verification code; {otp}</Preview>
            <Section>
                <Row>
                    <Heading>Hello {username}</Heading>
                </Row>
                <Row>
                    <Text>
                        Here &apos;s your verification code; {otp}
                    </Text>
                </Row>
            </Section>
            </Html>)
    }
