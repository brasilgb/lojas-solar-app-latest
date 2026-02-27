import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import appservice from '@/services/appservice'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/accordion'

type Pergunta = {
  pergunta: string
  resposta: string
}

type Categoria = {
  id: string
  xCategoria: string
  perguntas: Pergunta[]
}

const Crediario = () => {
  const [loading, setLoading] = useState(false)
  const [crediarios, setCrediarios] = useState<Categoria[]>([])

  useEffect(() => {
    const getCrediarios = async () => {
      try {
        setLoading(true)

        const response = await appservice.get('(WS_CARREGA_FAQ)')

        const categorias =
          response.data.resposta.data.categorias

        const filtradas = categorias
          .filter(
            (c: any) =>
              c.Categoria.xCategoria.trim() === 'Crediário'
          )
          .map((cat: any, index: number) => ({
            id: `cat-${index}`,
            xCategoria: cat.Categoria.xCategoria,
            perguntas: cat.Categoria.perguntas.filter(
              (p: any) => p.resposta !== ''
            ),
          }))

        setCrediarios(filtradas)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    getCrediarios()
  }, [])

  const perguntasFlat = crediarios.flatMap((categoria) =>
    categoria.perguntas.map((pergunta, idx) => ({
      ...pergunta,
      uniqueId: `${categoria.id}-q-${idx}`,
    }))
  )

  return (
    <View className="bg-white rounded-xl">
      <Accordion
        type="single"
        collapsible
        mode="light"
      >
        {perguntasFlat.map((pergunta, index) => {
          const isLast = index === perguntasFlat.length - 1

          return (
            <AccordionItem
              key={pergunta.uniqueId}
              id={pergunta.uniqueId}
              className={`${isLast ? 'border-0' : 'border-gray-200'} pr-6`}
            >
              <AccordionTrigger textClassName="text-sm px-2 flex-1">
                {pergunta.pergunta}
              </AccordionTrigger>

              <AccordionContent contentClassName="px-2">
                {pergunta.resposta}
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </View>
  )
}

export default Crediario
