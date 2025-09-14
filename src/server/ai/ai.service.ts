import { Body, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import OpenAI from "openai";
import { CourseList, StudentCourseEntity } from "src/entities/student-course.entity";
import { Repository } from "typeorm";
import { AICtxDto } from "./dto/AICtxDto";
import { RedisService } from "src/redis/redis.service";
import { getCurrentDate, getDateString, timeStampMap } from "src/utils/Time";

@Injectable()
export class AiService {
    constructor(
        @InjectRepository(StudentCourseEntity)
        private studentCourseMapper: Repository<StudentCourseEntity>,
        private readonly redisService: RedisService
    ) { }



    async main({ message }: AICtxDto) {
        const pattern = /[\u4e00-\u9fa5]+\d{4}班/;
        const match = message.match(pattern);
        let className: string | null;
        if (match) {
            className = match[0];
        } else {
            className = "软件2303班";
        }
        const courseList = await this.studentCourseMapper.find({
            where: {
                className: className
            }
        });
        function formatCourses() {
            return courseList.map((dayItem) => {
                const week = dayItem.week;
                const dayName = dayItem.weekDay;
                if (dayItem.courseList === '{}') return `${week}的${dayName}没有课`;
                const courseData: CourseList = JSON.parse(dayItem.courseList);
                const courseStr = Object.keys(courseData).map((key) => {
                    const course = courseData[key];
                    return `${key} 时间：${timeStampMap[key]} 课程名字：${course.courseName}，课程班级：${course.courseClass}，课程老师：${course.courseTeacher}，课程位置：${course.coursePosition}`;
                }).join("。\n");
                return `${week}的${dayName}的课表数据：\n${courseStr}`;
            }).join('\n');
        }
        // 获取当前周次
        let week = "";
        // 获取当前星期
        let weekDay = '周一';
        // 获取当前日期
        let dateObj = getDateString(new Date());
        let date = dateObj.date;
        // 获取缓存值
        const cacheWeek = await this.redisService.get('current-week');
        const cacheWeekDay = await this.redisService.get('current-week-day');
        if (!cacheWeek && !cacheWeekDay) {
            week = cacheWeek;
            weekDay = cacheWeekDay;
        }
        else {
            const { weekStr, weekDay: weekday } = getCurrentDate({
                year: dateObj.year,
                month: dateObj.month,
                day: dateObj.day
            });
            week = weekStr;
            weekDay = weekday;
            await this.redisService.set('current-week', week);
            await this.redisService.set('current-week-day', weekDay);
        }
        // 调用AI模型回答
        const openai = new OpenAI(
            {
                apiKey: "sk-a6e07d2622bc42268987214b96954166",
                baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
            }
        );
        const completion = await openai.chat.completions.create({

            model: "qwen-turbo",
            messages: [
                {
                    'role': 'user', "content": `你是一名大学生课程助理，负责帮助学生查询和分析他们的课程安排。以下是该用户当前学期的课程表：
            ${formatCourses()}
            今天的日期是 ${date} 当前周次${week} 当前星期${weekDay}
        请根据用户的问题${message}，给出自然语言的简洁回复，不要有特殊字符，可以用标点符号，让学生可以清晰的看到自己要上什么课，不重复问题。可以适当总结，语气可以欢快一点。`
                }
            ],
        });
        const result = completion.choices[0].message.content;
        return {
            content: result,
            // data: {
            //     courseList: courseList.filter(d => d.week === week && d.weekDay === weekDay),
            // }
        };
    }
}
