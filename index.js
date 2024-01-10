import inquirer from "inquirer"
import chalk from "chalk"
import fs, { existsSync } from 'fs'

console.log("Projeto Banco iniciado")


operation()

function operation() { //aqui terá todas as operações que o usuário for fazer
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer no Banco Project?',

            choices: [ //lista de opções para o meu usuário
                'Criar conta',
                'Depositar',
                'Consultar saldo',
                'Sacar',
                'Sair'
            ]
        }
    ])

    .then((options)=> {
        const resposta = options['action']

        if(resposta === 'Criar conta') {
            // se der true, vou chamar minha função de criar conta
            criarConta();
        }else if(resposta === 'Depositar') {
            depositar();
        }else if(resposta === 'Consultar saldo') {
            consultarSaldo();
        }else if(resposta === 'Sacar') {
            sacarSaldo();
        }else if(resposta === 'Sair') {
            console.log(chalk.bgBlue.black('Obrigado por usar o BancoProject'))
            process.exit(); //uso isso para encerrar o programa
        }
    })

    .catch((error)=> {
        console.log(chalk.red(error))
    })
}

function criarConta(criarConta) {
    inquirer.prompt([
        {
            name: 'p1',
            message: 'Qual o nome da conta?'
        }
    ])

    .then((NomeConta)=> {
        const nomeUsuario = NomeConta.p1
        
        //criando uma pasta com as contas criadas
        
        //vou verificar se existe uma pasta com o nome de contas
        if(!fs.existsSync('contas')) {
            fs.mkdirSync('contas')
        }

        //verificando se o nome do usuário existe, se existir, não crio outro com o mesmo nome
        if(fs.existsSync(`contas/${nomeUsuario}.json`)) {
            console.log(chalk.bgRed.black('Erro, essa conta já existe, tente novamente!'))
            operation()
            return //coloco o return aqui para não gerar bug
        }

        fs.writeFileSync(`contas/${nomeUsuario}.json`,'{"saldo" : 0}', (error)=> {})
        console.log(chalk.bgGreen.black('Parabéns, conta criada no BancoProject'))
        operation()
    })

    .catch((error)=> {
        console.log(error)
    })
}

function depositar() {
    inquirer.prompt([
        {
            name: 'p1',
            message: 'Digite o nome da sua conta'
        }
    ])
    .then((respostaDeposito)=> {
        const contaDeDeposito = respostaDeposito.p1
        
        if(!fs.existsSync(`contas/${contaDeDeposito}.json`)) {
            console.log(chalk.bgRed.black("Essa conta não existe, digite um nome válido"))
            depositar()
            return
        }

        if(fs.existsSync(`contas/${contaDeDeposito}.json`)) {
            inquirer.prompt([
                {
                    name: 'p2',
                    message: 'Digite o valor que você queira depositar...'
                }  
            ])
            .then((respostaDepositoo)=> {
                const valorDeposito = respostaDepositoo.p2
                fs.writeFileSync(`contas/${contaDeDeposito}.json`, `{"saldo" : ${Number(valorDeposito)}}`, (error)=> {
                })
                console.log(chalk.bgGreen.black(`O valor de R$${valorDeposito} foi depositado em sua conta. OBRIGADO POR ESCOLHER O BANCO PROJECT`))
                operation()
            })
            .catch((error)=> {
                console.log('deu erro')
                return
            })
            
        }
    })
    .catch((error)=> {
        console.log(error)
    })
}

function consultarSaldo() {
    inquirer.prompt([
        {
            name: 'p1',
            message: 'Qual o nome da sua conta?'
        }
    ])
    .then((resposta)=> {
        const respostaNome = resposta.p1

        //se minha conta não existir, vai mostrar um console.log
        if(!fs.existsSync(`contas/${respostaNome}.json`)) {
            console.log(chalk.bgRed.black('Esta conta não existe, use uma conta válida'))
            consultarSaldo()
            return
        }

        fs.readFile(`contas/${respostaNome}.json`, 'utf8', (error, data) => {
            if (error) {
                console.log(chalk.bgRed.black('Erro ao ler o arquivo:', error.message))
                return
            }

            // Convertendo o conteúdo para objeto JSON
            const json = JSON.parse(data)

            // Exibindo o saldo
            console.log(chalk.bgGreen.black(`Saldo da conta de ${respostaNome}: R$ ${json.saldo}`))

            // Continuando com as operações
            operation()
        })
        
    })
    .catch((error)=> {
        console.log(error)
    })
}

function sacarSaldo() {
    inquirer.prompt([
        {
            name: 'p1',
            message: 'Qual o nome da sua conta?'
        }
    ])

    .then((resposta)=> {
        const nomeUsuario = resposta.p1

        if(!fs.existsSync(`contas/${nomeUsuario}.json`)) {
            console.log(chalk.bgRed.black('Esta conta não existe, digite uma conta válida '))
            sacarSaldo()
            return;
        }

        if(fs.existsSync(`contas/${nomeUsuario}.json`)) {

            inquirer.prompt([
                {
                    name: 'p2',
                    message: 'Qual valor você deseja sacar?'
                }
            ])
            .then((respostaP2)=> {
                const valorDeSaque = respostaP2.p2;
                const valorDeSaqueNumber = Number(valorDeSaque);

                // Lê o conteúdo do arquivo
                fs.readFile(`contas/${nomeUsuario}.json`, 'utf-8', (error, data)=> {
                    if(error) {
                        console.log(error);
                        return;
                    }

                    // Convertendo o conteúdo para objeto JSON
                    let json = JSON.parse(data);

                    // Verificando se há saldo suficiente
                    if (valorDeSaqueNumber > json.saldo) {
                        console.log(chalk.bgRed.black('Saldo insuficiente para saque.'));
                        return;
                    }

                    // Subtraindo o valor do saldo atual
                     let amountConta = parseFloat(json.saldo) -  parseFloat(valorDeSaqueNumber);
                    

                    // Escrevendo o objeto JSON de volta no arquivo
                fs.writeFile(`contas/${nomeUsuario}.json`,`"{saldo: ${JSON.stringify(amountConta)}}"` , 'utf-8', (error) => {
                        if (error) {
                            console.log(error);
                            return;
                        }
                        console.log(chalk.bgGreen.black('Saque realizado com sucesso.'));
                        operation();
                    });
                });
            })
            .catch((error)=> {
                console.log(error);
            })
        }
    })
    .catch((error)=> {
        console.log(error);
    })
}
