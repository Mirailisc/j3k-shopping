import { Controller } from '@nestjs/common'
import { BillService } from './bill.service'

@Controller('bill')
export class BillController {
  constructor(private readonly billService: BillService) {}
}
