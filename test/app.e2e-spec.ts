import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { AppModule } from "../src/app.module"
import { LoginAuthDto, SignUpAuthDto } from "src/auth/dto"
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

    pactum.request.setBaseUrl('http://localhost:6000')

    afterAll(async () => {
        await app.close()
    })

    describe('Auth', () => {
        describe('Signup', () => {
            const dto: SignUpAuthDto = {
                fullName: 'Test User',
                email: 'test11@email.com',
                password: '1234',
            }
            // it('Should signup a user', () => {
            //     return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201)
            // })

            it('Should not signup cause fullName blank', () => {
                return pactum.spec().post('/auth/signup').withBody({
                    fullName: '',
                    email: dto.email,
                    password: dto.password,
                }).expectStatus(400)
            })

            it('Should not signup cause email blank', () => {
                return pactum.spec().post('/auth/signup').withBody({
                    fullName: dto.fullName,
                    email: '',
                    password: dto.password,
                }).expectStatus(400)
            })

            it('Should not signup cause password blank', () => {
                return pactum.spec().post('/auth/signup').withBody({
                    fullName: dto.fullName,
                    email: dto.email,
                    password: '',
                }).expectStatus(400)
            })
        })

        describe('Signin', () => {
            const dto: LoginAuthDto = {
                email: 'test11@email.com',
                password: '1234',
            }

            it('Should signin a user', () => {
                return pactum.spec().post('/auth/login').withBody(dto).expectStatus(200)
            })

            it('Should not signin cause email blank', () => {
                return pactum.spec().post('/auth/login').withBody({
                    email: '',
                    password: dto.password,
                }).expectStatus(400)
            })

            it('Should not signin cause password blank', () => {
                return pactum.spec().post('/auth/login').withBody({
                    email: dto.email,
                    password: '',
                }).expectStatus(400)
            })

            it('Should not signin cause email not exist', () => {
                return pactum.spec().post('/auth/login').withBody({
                    email: 'test@gmail.com',
                    password: dto.password,
                }).expectStatus(403)
            })
        })
    })
})

