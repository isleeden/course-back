import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateFieldDto } from './dto/create-field.dto';
import { FieldService } from './field.service';

@Controller('field')
export class FieldController {
  constructor(private fieldService: FieldService) {}

  @Post()
  addItem(@Body() fieldDto: CreateFieldDto) {
    return this.fieldService.addField(fieldDto);
  }
}
