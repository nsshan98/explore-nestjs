import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { SignUpAuthDto } from "src/auth/dto"
import * as pactum from 'pactum'

describe('App e2e', () => {
    let app: INestApplication

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleRef.createNestApplication()
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
        }))
        await app.init()
    })

    afterAll(async () => {
        await app.close()
    })

    describe('Auth', () => {
        describe('Signup', () => {
            it('Should signup a user', () => {
                const dto: SignUpAuthDto = {
                    fullName: 'Test User',
                    email: 'test10@email.com',
                    password: '1234',
                }
                return pactum.spec().post('http://localhost:6000/auth/signup').withBody(dto).expectStatus(201).inspect()
            })
        })
    })


    it.todo('Should pass')
})

