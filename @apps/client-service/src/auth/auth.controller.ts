import { Body, Controller, Get, Param, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDTO } from './auth.dto';
import { Response } from 'express';
import { CreateUserDTO } from '../user/user.dto';
import { CreateBusinessDTO } from '../business/business.dto';

@Controller('auth')
@UsePipes(
    new ValidationPipe({
        transform: true,
        whitelist: true
    })
)
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('signup') 
    async signup(@Body() signupBody: CreateUserDTO){
        console.log("Signup body")
        console.log(signupBody)
        return await this.authService.signup(signupBody);
    }

    @Get('verify-email/:token')
    async verifyEmail(@Param("token") token: string){
        const email = await this.authService.verifyEmail(token);
        return `Email ${email} verified successfully`;
    }

    @Post('login')
    async login(@Body() loginBody: LoginAuthDTO, @Res() res: Response){

       const auth = await this.authService.login(loginBody);
        // Set data on client
        res.cookie("__uAud", auth.__uAud, { maxAge: 60 * 60 * 1000 * 24 * 7 * 52, httpOnly: true }); //1 yr
        // accessToken
        res.cookie("__ASSEMBLYsxvscz090619_", auth.__ASSEMBLYsxvscz090619_, { maxAge: 60 * 60 * 1000 * 24, httpOnly: true }); //1 day

       return res.json({ message:"You are logged in", __auth: auth.__uAud, accessToken: auth.__ASSEMBLYsxvscz090619_});
    }

    @Post('login-or-signup')
    async loginOrSignup(@Body() loginBody: LoginAuthDTO, @Res() res: Response, @Req() req: any){

        // Check if email already exist in database
        const isUser = await this.authService.getIsUser(loginBody.email);

        if(!isUser){
            await this.authService.signup({ ...loginBody, confirmPassword: loginBody.password });
        } 

        const auth = await this.authService.login(loginBody);
        // Set data on client
        res.cookie("__uAud", auth.__uAud, { maxAge: 60 * 60 * 1000 * 24 * 7 * 52, httpOnly: true }); //1 yr
        // accessToken
        res.cookie("__ASSEMBLYsxvscz090619_", auth.__ASSEMBLYsxvscz090619_, { maxAge: 60 * 60 * 1000 * 24, httpOnly: true }); //1 day

        // Complete business creation with updates
        const business = await this.authService.createBusinessComplete(req.cookies["__bizId"], auth.userId);

        // Remove __bizId from cookie storage
        res.cookie("__bizId", null, { maxAge: -1 });
        // Send business detail to the client cookie. Will be removed
        res.cookie("business", JSON.stringify(business), { maxAge: 60 * 60 * 1000 * 24 * 7 * 52 }); //1 yr

        return res.sendStatus(200);

    }

    @Post("create-business")
    async createBusiness(@Body() createBusinessBody: CreateBusinessDTO, @Req() req: any, @Res() res: Response){
        const response = await this.authService.createBusiness(createBusinessBody, req.user?.id);

        // Send businessId back to user
        res.cookie("__bizId", response.businessId, { maxAge: 60 * 60 * 1000 * 24 * 7 * 52 }); //1 yr

        if(!response.pending){
            res.cookie("business", JSON.stringify(response.business), { maxAge: 60 * 60 * 1000 * 24 * 7 * 52 }); //1 yr
        }

        // Send status. true if business is yet to have a UserBusiness relationship
        return res.json({ pending: response.pending });
    }
}
