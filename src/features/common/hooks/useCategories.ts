// import { api } from '@/convex/_generated/api'
// import { convexQuery } from '@convex-dev/react-query'
// import { useQuery } from '@tanstack/react-query'

const useCategories = () => {
  // const { data: data2 } = useQuery({
  //   ...convexQuery(api.categories.getCategories),
  // })

  const data = [
    {
      id: '605196',
      label: 'Automotivo',
    },
    {
      id: '602284',
      label: 'Bebê e maternidade',
    },
    {
      id: '601450',
      label: 'Beleza e cuidados pessoais',
    },
    {
      id: '801928',
      label: 'Livros, revistas e áudio',
    },
    {
      id: '951432',
      label: 'Colecionáveis',
    },
    {
      id: '601755',
      label: 'Computadores e equipamentos de escritório',
    },
    {
      id: '605248',
      label: 'Acessórios de moda',
    },
    {
      id: '700437',
      label: 'Alimentos e bebidas',
    },
    {
      id: '604453',
      label: 'Móveis',
    },
    {
      id: '700645',
      label: 'Saúde',
    },
    {
      id: '604968',
      label: 'Melhorias para o lar',
    },
    {
      id: '600001',
      label: 'Suprimentos para o lar',
    },
    {
      id: '600942',
      label: 'Eletrodomésticos',
    },
    {
      id: '953224',
      label: 'Joias, acessórios e derivados',
    },
    {
      id: '802184',
      label: 'Moda infantil',
    },
    {
      id: '600024',
      label: 'Utensílios de cozinha',
    },
    {
      id: '824584',
      label: 'Malas e bolsas',
    },
    {
      id: '824328',
      label: 'Moda masculina e underwear',
    },
    {
      id: '601303',
      label: 'Moda muçulmana',
    },
    {
      id: '602118',
      label: 'Suprimentos para animais de estimação',
    },
    {
      id: '601739',
      label: 'Celulares e eletrônicos',
    },
    {
      id: '856720',
      label: 'Usados',
    },
    {
      id: '601352',
      label: 'Sapatos',
    },
    {
      id: '603014',
      label: 'Esportes e lazer',
    },
    {
      id: '600154',
      label: 'Têxteis e artigos de cama, mesa e banho',
    },
    {
      id: '604579',
      label: 'Ferramentas e ferragens',
    },
    {
      id: '604206',
      label: 'Brinquedos e hobbies',
    },
    {
      id: '834312',
      label: 'Produtos virtuais',
    },
    {
      id: '601152',
      label: 'Moda feminina e underwear',
    },
  ]

  const dataSorted = data.sort((a, b) => a.label.localeCompare(b.label))

  return {
    data: [
      {
        id: 'all',
        label: 'Todas as categorias',
      },
      ...dataSorted,
    ],
  }
}

export default useCategories
