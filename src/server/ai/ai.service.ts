import { Body, Injectable, Res, Sse } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import OpenAI from 'openai';
import {
  CourseList,
  StudentCourseEntity,
} from 'src/entities/student-course.entity';
import { Repository } from 'typeorm';
import { AICtxDto } from './dto/AICtxDto';
import { RedisService } from 'src/redis/redis.service';
import { getCurrentDate, getDateString, timeStampMap } from 'src/utils/Time';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(StudentCourseEntity)
    private studentCourseMapper: Repository<StudentCourseEntity>,
    private readonly redisService: RedisService,
  ) {}

  async main({ message }: AICtxDto) {
    const pattern = /[\u4e00-\u9fa5]+\d{4}班/;
    const match = message.match(pattern);
    let className: string | null;
    if (match) {
      className = match[0];
    } else {
      className = '软件2303班';
    }
    console.log('className', className);
    const courseList = await this.studentCourseMapper.find({
      where: {
        className: className,
      },
    });
    const formatCourses = () => {
      return courseList
        .map((dayItem) => {
          const week = dayItem.week;
          const dayName = dayItem.weekDay;
          if (dayItem.courseList === '{}') return `${week}的${dayName}没有课`;
          const courseData: CourseList = JSON.parse(dayItem.courseList);
          const courseStr = Object.keys(courseData)
            .map((key) => {
              const course = courseData[key];
              return `${key} 时间：${timeStampMap[key]} 课程名字：${course.courseName}，课程班级：${course.courseClass}，课程老师：${course.courseTeacher}，课程位置：${course.coursePosition}`;
            })
            .join('。\n');
          return `${week}的${dayName}的课表数据：\n${courseStr}`;
        })
        .join('\n');
    };
    // 获取当前周次
    let week = '';
    // 获取当前星期
    let weekDay = '周一';
    // 获取当前日期
    let dateObj = getDateString(new Date());
    let date = dateObj.date;
    // 获取缓存值
    const { weekStr, weekDay: weekday } = getCurrentDate({
      year: dateObj.year,
      month: dateObj.month,
      day: dateObj.day,
    });
    week = weekStr;
    weekDay = weekday;

    // 调用AI模型回答
    const openai = new OpenAI({
      apiKey: 'sk-a6e07d2622bc42268987214b96954166',
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    });
    const completion = await openai.chat.completions.create({
      model: 'qwen-flash',
      messages: [
        {
          role: 'user',
          content: `你是一名大学生课程助理，负责帮助学生查询和分析他们的课程安排。以下是该用户当前学期的课程表：
            ${formatCourses()}
            今天的日期是 ${date} 当前周次${week} 当前星期${weekDay}
        请根据用户的问题${message}，给出自然语言的简洁回复，不要有特殊字符，可以用标点符号，让学生可以清晰的看到自己要上什么课，不重复问题。可以适当总结，语气可以欢快一点。`,
        },
      ],
    });
    console.log(`你是一名大学生课程助理，负责帮助学生查询和分析他们的课程安排。以下是该用户当前学期的课程表：
            ${formatCourses()}
            今天的日期是 ${date} 当前周次是${week} 当前星期是${weekDay}
        请根据用户的问题:${message}，给出自然语言的简洁回复，不要有特殊字符，可以用标点符号，让学生可以清晰的看到自己要上什么课，不重复问题。可以适当总结，语气可以欢快一点。`);
    const result = completion.choices[0].message.content;
    return {
      content: result,
      usage: completion.usage,
    };
  }

  @Sse()
  async *stream({ message }: AICtxDto) {
    const pattern = /[\u4e00-\u9fa5]+\d{4}班/;
    const match = message.match(pattern);
    let className: string | null;
    if (match) {
      className = match[0];
    } else {
      className = '软件2303班';
    }
    const courseList = await this.studentCourseMapper.find({
      where: {
        className: className,
      },
    });
    const formatCourses = () => {
      return courseList
        .map((dayItem) => {
          const week = dayItem.week;
          const dayName = dayItem.weekDay;
          if (dayItem.courseList === '{}') return `${week}的${dayName}没有课`;
          const courseData: CourseList = JSON.parse(dayItem.courseList);
          const courseStr = Object.keys(courseData)
            .map((key) => {
              const course = courseData[key];
              return `${key} 时间：${timeStampMap[key]} 课程名字：${course.courseName}，课程班级：${course.courseClass}，课程老师：${course.courseTeacher}，课程位置：${course.coursePosition}`;
            })
            .join('。\n');
          return `${week}的${dayName}的课表数据：\n${courseStr}`;
        })
        .join('\n');
    };
    // 获取当前周次
    let week = '';
    // 获取当前星期
    let weekDay = '周一';
    // 获取当前日期
    let dateObj = getDateString(new Date());
    let date = dateObj.date;
    // 获取缓存值
    const { weekStr, weekDay: weekday } = getCurrentDate({
      year: dateObj.year,
      month: dateObj.month,
      day: dateObj.day,
    });
    week = weekStr;
    weekDay = weekday;

    // 调用AI模型回答
    const openai = new OpenAI({
      apiKey: 'sk-a6e07d2622bc42268987214b96954166',
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    });

    const prompt = `你是一名大学生课程助理，负责帮助学生查询和分析他们的课程安排。以下是该用户当前学期的课程表：
        ${formatCourses()}
        今天的日期是 ${date} 学期第${week} ${weekDay}

请根据用户的问题 ${message}。生成一个简洁、自然语言的回答。输出格式要求如下：
1. 课表相关数据必须以层级清晰的格式输出，避免堆在一段话里。
2. 每门课单独用列表展示，格式示例：
   - **课程名称**：星期：/ 上课时间： / 上课地点: / 授课老师:
3. 如果有多节课，按照时间顺序排列。
4. 可在开头用简短自然语言总结（例如“今天课程安排如下，很充实哦！”），但核心的课程信息要以列表形式展示。
5. 语气轻松、欢快。
6. 如果用户的问题不是关于课表的，就回答：“我只是一个课程助手，只能回答课表相关的问题。”`;
    console.log(prompt);
    const completion = await openai.chat.completions.create({
      model: 'qwen3-max',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      stream: true,
    });
    let token = prompt.length;
    for await (const part of completion) {
      const delta = part.choices[0].delta.content;
      if (delta) {
        token += delta.length;
        yield delta;
      }
    }
    yield {
      token,
    };
  }
}
