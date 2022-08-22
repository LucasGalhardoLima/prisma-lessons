import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  IsOptional,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @MinLength(5)
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  @ApiProperty({ required: false })
  description?: string;

  @IsString()
  @ApiProperty()
  body: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  published?: boolean = false;
}
