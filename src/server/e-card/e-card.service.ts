import { Injectable } from '@nestjs/common';
import { ElectivesQueryDto } from './dto/ElectricQueryDto';
import axios from 'axios';

@Injectable()
export class StudentCourseService {
  constructor() {}

  async electric(electricQuery: ElectivesQueryDto) {
    console.log(electricQuery);
    const result = await axios.get(
      'http://123.56.64.221:3000/electric' + '?dormId=' + electricQuery.dormId,
    );
    console.log(result.data.data);
    return JSON.parse(result.data.data);
  }
}
