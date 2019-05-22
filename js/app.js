// Define the `phonecatApp` module
var myApp = angular.module('appModule', ['ntt.TreeDnD']);

// Define the `PhoneListController` controller on the `phonecatApp` module
myApp.controller('treeController', ($scope, $http, $TreeDnDConvert) => {
  $scope.my_tree = {};
  $scope.expanding_property = {
    /*template: "<td>OK All</td>",*/
    field:       'id',
    titleClass:  'text-center',
    cellClass:   'v-middle',
    displayName: 'Id'
  };
  $scope.col_defs = [
    {
        field: 'nome'
    }
];
  $scope.dadosTreeGrid = [];

  $scope.getCapitulo = function(id){
    var capitulos = [
        {
            id: 1,
            nome: 'Capítulo 1',
            composicoes: []
        },
        {
            id: 2,
            nome: 'Capítulo 2',
            composicoes: [
                {
                    id: 1,
                    nome: 'Composição 1'
                },
                {
                    id: 2,
                    nome: 'Composição 2'
                }
            ]
        },
        {
            id: 3,
            nome: 'Capítulo 3',
            composicoes: []
        },
    ];

    return new Promise((resolve, reject) => {
        let capitulo = capitulos.find((el)=>{
            if (el.id == id){
                return el;
            }
        });

        $http.get("http://demo1619443.mockable.io/capitulo").then(function(response) {
            $scope.myWelcome = response.data;
            console.log($scope.myWelcome);
            resolve(capitulo);
        });
    });
  }

  $scope.getComposicao = function(id){
    var composicoes = [
        {
            id: 1,
            nome: 'Composição 1',
            funcoes: [
                {
                    id: 1,
                    nome: 'Função 1'
                }
            ]
        },
        {
            id: 2,
            nome: 'Composição 2',
            funcoes: [
                {
                    id: 1,
                    nome: 'Função 1'
                },
                {
                    id: 1,
                    nome: 'Função 2'
                }
            ]
        }
    ];

    return new Promise((resolve, reject) => {
        let composicao = composicoes.find((el)=>{
            if (el.id == id){
                return el;
            }
        });

        $http.get("http://demo1619443.mockable.io/capitulo").then(function(response) {
            $scope.myWelcome = response.data;
            console.log($scope.myWelcome);
            resolve(composicao);
        });
    });
  }

  $scope.montarDados = function(){
    var capitulos = [
        {
            id: 1,
            nome: 'Capítulo 1'
        },
        {
            id: 2,
            nome: 'Capítulo 2'
        },
        {
            id: 3,
            nome: 'Capítulo 3'
        }
    ];

    let formataCapitulo = function(id){
        return new Promise(async (resolve, reject) =>{
            await $scope.getCapitulo(id).then(async (capitulo)=>{
                console.log('Capítulo completo', capitulo);
                capitulo.__children__ = [];

                //Busco composições desse capítulo
                for (let index = 0; index < capitulo.composicoes.length; index++) {
                    const elComposicao = capitulo.composicoes[index];
                    let arrComposicoes = [];

                    await $scope.getComposicao(elComposicao.id).then((composicao)=>{
                        capitulo.composicoes[index] = composicao;

                        let cmp = {
                            id: composicao.id,
                            nome: composicao.nome,
                            __children__: composicao.funcoes,
                            obj: composicao
                        }
                        
                        capitulo.__children__.push(cmp);
                    });
                }
                
                //Retorno o capítulo na Promise
                resolve(capitulo);
            });
        });
    }
    let getDados = function(capitulo){
        return new Promise(async (resolve, reject) => {
            let arrCapitulos = [];
            for (let index = 0; index < capitulos.length; index++) {
                const el = capitulos[index];
                
                await formataCapitulo(el.id).then(async (capitulo)=>{
                    console.log('Capítulo completo', capitulo);
                
                    for (let index = 0; index < capitulo.composicoes.length; index++) {
                        const elComposicao = capitulo.composicoes[index];
                        
                        await $scope.getComposicao(elComposicao.id).then((composicao)=>{
                            capitulo.composicoes[index] = composicao;
                        });
                    }
                    
                    arrCapitulos.push(capitulo);
                });
            }

            resolve(arrCapitulos);
        });
    };

    getDados(null).then((dados)=>{
        console.log('Dados', dados);
        $scope.$apply(function () {
            $scope.dadosTreeGrid = dados;
        });
    });
  }

  $scope.montarDados();
});