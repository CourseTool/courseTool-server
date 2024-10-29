import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateLogEntity } from '../../entities/update-log.entity';
import { Between, LessThan, Repository } from 'typeorm';
import { NewbornAqEntity } from '../../entities/newbornAq.entity';
import { DormEntity } from '../../entities/dorm.entity';
import { Student_listEntity } from '../../entities/student_list.entity';
import { getDaysSinceYearStart, Time } from '../../utils/Time';
import { AdvertisementEntity } from '../../entities/advertisement.entity';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(UpdateLogEntity)
    private readonly updateLogMapper: Repository<UpdateLogEntity>,
    @InjectRepository(NewbornAqEntity)
    private readonly newbornAqMapper: Repository<NewbornAqEntity>,
    @InjectRepository(DormEntity)
    private readonly dormMapper: Repository<DormEntity>,
    @InjectRepository(Student_listEntity)
    private Student_listMapper: Repository<Student_listEntity>,
    @InjectRepository(AdvertisementEntity)
    private advertisementMapper: Repository<AdvertisementEntity>,
    private readonly redisService: RedisService,
  ) {}

  updateLog() {
    return this.updateLogMapper
      .createQueryBuilder()
      .orderBy('id', 'DESC')
      .getOne();
  }

  message() {
    return '';
  }

  newbornAq() {
    return this.newbornAqMapper.find();
  }

  async dormQuestion() {
    const questionList = [
      {
        title: '姓名',
        key: 'name',
        type: 'select',
      },
      {
        title: '学号',
        key: 'code',
        type: 'input',
      },
      {
        title: '性别',
        type: 'select',
        key: 'sex',
        selectValue: [
          {
            text: '男',
            value: '男',
          },

          {
            text: '女',
            value: '女',
          },
        ],
      },
      {
        title: '班级',
        key: 'class',
        type: 'input',
      },
      {
        title: '宿舍打扫频率',
        type: 'select',
        key: 'clear_rate',
        selectValue: [
          {
            text: '两到三天一次',
            value: '两到三天一次',
          },
          {
            text: '一周一次',
            value: '一周一次',
          },
          {
            text: '脏了就打扫,没有规定时间',
            value: '脏了就打扫,没有规定时间',
          },
        ],
      },
      {
        title: '对温度的敏感性',
        type: 'select',
        key: 'temperature',
        selectValue: [
          {
            text: '怕冷',
            value: '怕冷',
          },
          {
            text: '怕热',
            value: '怕热',
          },
          {
            text: '无所谓',
            value: '无所谓',
          },
        ],
      },
      {
        title: '睡觉是否打呼噜',
        type: 'select',
        key: 'isSnore',
        selectValue: [
          {
            text: '是',
            value: '是',
          },
          {
            text: '否',
            value: '否',
          },
          {
            text: '不知道',
            value: '不知道',
          },
        ],
      },
      {
        title: '接受异味食品',
        type: 'select',
        key: 'peculiarSmell',
        selectValue: [
          {
            text: '是',
            value: '是',
          },
          {
            text: '否',
            value: '否',
          },
          {
            text: '无所谓',
            value: '无所谓',
          },
        ],
      },
      {
        title: '是否吸烟',
        type: 'select',
        key: 'isSmoke',
        selectValue: [
          {
            text: '吸烟,但是会出去或者去厕所抽',
            value: '吸烟,但是会出去或者去厕所抽',
          },
          {
            text: '吸烟,在寝室内抽',
            value: '吸烟,在寝室内抽',
          },
          {
            text: '不吸烟',
            value: '不吸烟',
          },
        ],
      },
      {
        title: '醒来方式',
        type: 'select',
        key: 'upMethod',
        selectValue: [
          {
            text: '习惯定闹钟但总是赖床',
            value: '习惯定闹钟但总是赖床',
          },
          {
            text: '闹钟',
            value: '闹钟',
          },
          {
            text: '自然醒来',
            value: '自然醒来',
          },
        ],
      },
      {
        title: '喜欢的环境',
        type: 'select',
        key: 'likeEnv',
        selectValue: [
          {
            text: '介于两者之间的',
            value: '介于两者之间的',
          },
          {
            text: '安静的',
            value: '安静的',
          },
          {
            text: '热闹的',
            value: '热闹的',
          },
        ],
      },
      {
        title: '兴趣爱好',
        type: 'select',
        key: 'interest',
        selectValue: [
          {
            text: '偏静型',
            value: '偏静型',
          },
          {
            text: '偏动型',
            value: '偏动型',
          },
        ],
      },
      {
        title: '是否早睡早起',
        type: 'select',
        key: 'isSleepLate',
        selectValue: [
          {
            text: '早睡早起',
            value: '早睡早起',
          },
          {
            text: '正常作息',
            value: '正常作息',
          },
        ],
      },
      {
        title: '是否喜欢打游戏',
        type: 'select',
        key: 'isLikeGame',
        selectValue: [
          {
            text: '喜欢并且喜欢声音外放',
            value: '喜欢并且喜欢声音外放',
          },
          {
            text: '喜欢但是会注意音量',
            value: '喜欢但是会注意音量',
          },
          {
            text: '不喜欢',
            value: '不喜欢',
          },
        ],
      },
      {
        title: '是否有午睡习惯',
        type: 'select',
        key: 'isSiesta',
        selectValue: [
          {
            text: '有',
            value: '有',
          },
          {
            text: '没有',
            value: '没有',
          },
        ],
      },
    ];
    questionList[0].selectValue = await this.getNewStudentList();
    return questionList;
  }

  async dormAllocation(data) {
    // 权重 值越高代表习惯或者素质越好
    const assignWeight = {
      clear_rate: {
        两到三天一次: 5,
        一周一次: 3,
        '脏了就打扫,没有规定时间': 1,
      },
      temperature: {
        怕冷: 3,
        怕热: 3,
        无所谓: 1,
      },
      isSnore: {
        是: 3,
        否: 5,
        不知道: 2,
      },
      peculiarSmell: {
        是: 5,
        否: 1,
        无所谓: 3,
      },
      isSmoke: {
        '吸烟,但是会出去或者去厕所抽': 3,
        '吸烟,在寝室内抽': 1,
        不吸烟: 5,
      },
      upMethod: {
        习惯定闹钟但总是赖床: 2,
        闹钟: 3,
        自然醒来: 5,
      },
      likeEnv: {
        介于两者之间的: 3,
        安静的: 5,
        热闹的: 1,
      },
      interest: {
        偏静型: 3,
        偏动型: 3,
      },
      isSleepLate: {
        早睡早起: 5,
        正常作息: 3,
      },
      isLikeGame: {
        喜欢并且喜欢声音外放: 1,
        喜欢但是会注意音量: 3,
        不喜欢: 5,
      },
      isSiesta: {
        有: 3,
        没有: 1,
      },
    };
    const classStudentCountMap = {
      区块链2401班: 45,
      区块链2402班: 43,
      人工智能2401班: 44,
      人工智能2402班: 43,
      人工智能2403班: 40,
      软件2404班: 45,
      软件2405班: 45,
      软件2406班: 45,
      软件2407班: 40,
      软件2408班: 44,
      软件2409班: 44,
      软件2410班: 44,
      移动应用2401班: 45,
      移动应用2402班: 45,
    };
    let weightTotal = 0;
    for (let k in data) {
      const value = data[k];
      if (k in assignWeight) {
        const type = assignWeight[k];
        const weight = type[value];
        weightTotal += weight;
      }
    }
    // 更新学生的宿舍权重值
    await this.Student_listMapper.createQueryBuilder()
      .update()
      .set({
        dorm_weight: weightTotal,
        weight_detail: JSON.stringify(data),
        has_dorm: 1,
      })
      .where('id = :id', { id: data.student_id })
      .execute();
    console.log('学生已分配宿舍权重', weightTotal);
    // 查找所有学生
    const studentList = await this.Student_listMapper.find({
      where: {
        has_dorm: 1,
      },
    });
    for (const student of studentList) {
      // 先判断有没有已存在的宿舍
      let result = await this.dormMapper.count();
      console.log('已存在的宿舍数量:', result);
      if (result === 0) {
        // 没有任何一间宿舍,新建宿舍
        console.log('没有任何一间宿舍,新建宿舍');
        await this.dormMapper
          .createQueryBuilder()
          .insert()
          .values([
            {
              student_id: student.id.toString(),
              class: student.class,
              weight_total: student.dorm_weight,
              weight_average: student.dorm_weight,
              student_count: 1,
            },
          ])
          .execute();
      }
      // 查找有没有适合的宿舍
      const topWeight = student.dorm_weight + 5; // 上限权重
      const lowerWeight = student.dorm_weight - 5; // 下限权重
      const suitableDorm = await this.dormMapper.findOne({
        where: {
          weight_average: Between(lowerWeight, topWeight),
          class: student.class,
          student_count: LessThan(8),
        },
        order: {
          weight_average: 'ASC',
        },
      });
      if (suitableDorm !== null) {
        // 找到合适的宿舍,更新宿舍信息
        console.log('找到了适合的宿舍,开始更新宿舍信息');
        const dorm = suitableDorm;
        const weightTotal = dorm.weight_total + student.dorm_weight;
        const weightAverage = weightTotal / (dorm.student_count + 1);
        await this.dormMapper
          .createQueryBuilder()
          .update()
          .set({
            weight_total: weightTotal,
            weight_average: weightAverage,
            student_count: dorm.student_count + 1,
            student_id: dorm.student_id + ',' + student.id,
          })
          .where({
            id: suitableDorm.id,
          })
          .execute();
      } else {
        // 没有找到合适的宿舍,新建一个宿舍
        console.log('宿舍数量不为0,且没有找到合适的宿舍,只能新建宿舍');

        // 先查看该班级宿舍是否达到上限
        const dormCount = await this.dormMapper.count({
          where: {
            class: student.class,
          },
        });
        if (dormCount >= Math.floor(classStudentCountMap[student.class] / 8)) {
          // 已经达到上限,无法再创建宿舍
          console.log('该班级宿舍数量已达到上限,无法再创建宿舍');
          return null;
        } else {
          // 班级宿舍还没到达上限 新建宿舍
          const result = await this.dormMapper
            .createQueryBuilder()
            .insert()
            .values([
              {
                student_id: student.id.toString(),
                class: student.class,
                weight_total: student.dorm_weight,
                weight_average: student.dorm_weight,
                student_count: 1,
              },
            ])
            .execute();
        }
      }
    }
  }

  async getNewStudentList() {
    const result = await this.Student_listMapper.createQueryBuilder(
      'student_list',
    )
      .where({
        has_dorm: 0,
      })
      .getMany();
    return result.map((item) => {
      return {
        text: item.name,
        value: item.name,
        id: item.id,
      };
    });
  }

  career(careerData: any) {
    const student_id = careerData.student_id;
    return this.Student_listMapper.createQueryBuilder()
      .update()
      .set({
        career: JSON.stringify(careerData.result),
      })
      .where({
        id: student_id,
      })
      .execute();
  }

  holland(hollandData: any) {
    const student_id = hollandData.student_id;
    return this.Student_listMapper.createQueryBuilder()
      .update()
      .set({
        holland: JSON.stringify(hollandData.result),
      })
      .where({
        id: student_id,
      })
      .execute();
  }

  async config() {
    // 月份从零开始
    const oldValue = await this.redisService.get('course-config');
    if (oldValue) {
      // @ts-ignore
      return oldValue;
    }
    const config = {
      start_date: '2024-09-01',
      end_date: '2025-02-20',
      start_month: 9,
      start_day: 2,
      disDay: 0,
    };
    config.disDay = getDaysSinceYearStart(config.start_date);
    this.redisService.setex('course-config', Time.ONE_MONTH * 4, config);
    return config;
  }

  async advertisementImg() {
    let result = await this.advertisementMapper.find();
    return result.map((d) => d.img_url);
  }
}
