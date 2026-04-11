import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/actions/(.*)$': '<rootDir>/src/app/actions/$1',
    '^@/apiKeys/(.*)$': '<rootDir>/src/features/apiKeys/$1',
    '^@/featuresFlag/(.*)$': '<rootDir>/src/features/common/featuresFlag/$1',
    '^@/categories/(.*)$': '<rootDir>/src/features/categories/$1',
    '^@/blog/(.*)$': '<rootDir>/src/features/blog/$1',
    '^@/components/(.*)$': '<rootDir>/src/features/common/components/$1',
    '^@/contact/(.*)$': '<rootDir>/src/features/contact/$1',
    '^@/convex/(.*)$': '<rootDir>/convex/$1',
    '^@/db/(.*)$': '<rootDir>/src/features/db/$1',
    '^@/dtos/(.*)$': '<rootDir>/src/features/common/dtos/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/features/common/hooks/$1',
    '^@/payment/(.*)$': '<rootDir>/src/features/payment/$1',
    '^@/product/(.*)$': '<rootDir>/src/features/product/$1',
    '^@/products/(.*)$': '<rootDir>/src/features/products/$1',
    '^@/providers/(.*)$': '<rootDir>/src/providers/$1',
    '^@/saved/(.*)$': '<rootDir>/src/features/saved/$1',
    '^@/stores/(.*)$': '<rootDir>/src/features/stores/$1',
    '^@/types/(.*)$': '<rootDir>/src/features/common/types/$1',
    '^@/utils/(.*)$': '<rootDir>/src/features/common/utils/$1',
    '^@/videos/(.*)$': '<rootDir>/src/features/videos/$1',
    '^@/ui/(.*)$': '<rootDir>/src/features/common/components/ui/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)
