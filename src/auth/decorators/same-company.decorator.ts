// src/auth/decorators/same-company.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const SAME_COMPANY_KEY = 'sameCompany';

export const SameCompany = () => SetMetadata(SAME_COMPANY_KEY, true);
