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

const Comercial = () => {
  const [loading, setLoading] = useState(false)
  const [comerciais, setComerciais] = useState<Categoria[]>([])

  useEffect(() => {
    const getComerciais = async () => {
      try {
        setLoading(true)

        const response = await appservice.get('(WS_CARREGA_FAQ)')

        const categorias =
          response.data.resposta.data.categorias

        const filtradas = categorias
          .filter(
            (c: any) =>
              c.Categoria.xCategoria.trim() === 'Comercial'
          )
          .map((cat: any, index: number) => ({
            id: `cat-${index}`,
            xCategoria: cat.Categoria.xCategoria,
            perguntas: cat.Categoria.perguntas.filter(
              (p: any) => p.resposta !== ''
            ),
          }))

        setComerciais(filtradas)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    getComerciais()
  }, [])

  return (
    <View className="bg-white rounded-xl">
      <Accordion
        type="single"
        collapsible
        mode="light"
      >
        {comerciais.flatMap((categoria) =>
          categoria.perguntas.map((pergunta, idx) => {
            const uniqueId = `${categoria.id}-q-${idx}`

            return (
              <AccordionItem
                key={uniqueId}
                id={uniqueId}
                className="border-gray-200"
              >
                <AccordionTrigger textClassName="text-sm px-2 flex-1">
                  {pergunta.pergunta}
                </AccordionTrigger>

                <AccordionContent contentClassName="px-2">
                  {pergunta.resposta}
                </AccordionContent>
              </AccordionItem>
            )
          })
        )}
      </Accordion>
    </View>
  )
}

export default Comercial
