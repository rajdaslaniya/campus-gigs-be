import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt.auth.guard";

@Controller("")
@UseGuards(JwtAuthGuard)
export class ProfileController {
    @Get("profile")
    getProfile() {}
}