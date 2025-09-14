import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AiService } from "./ai.service";
import { AICtxDto } from "./dto/AICtxDto";

@ApiTags('AI功能接口')
@Controller('ai')
export class AiController {
    constructor(
        private readonly aiService: AiService
    ) {

    }

    @Post('/')
    async main(@Body() body: AICtxDto) {
        return this.aiService.main(body);
    }
}
