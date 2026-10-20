import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

interface CreateOrderInput {
  planId: string;
}

export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: CreateOrderInput) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("id,price,published,duration_days")
      .eq("id", data.planId)
      .single();

    if (planError || !plan) {
      throw new Error("Plano não encontrado.");
    }
    if (!plan.published) {
      throw new Error("Este plano não está disponível para contratação.");
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        plan_id: plan.id,
        amount: plan.price,
        status: "pending",
        delivery_status: "pendente",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      throw new Error("Não foi possível criar o pedido. Tente novamente.");
    }

    const { error: paymentError } = await supabase.from("payments").insert({
      order_id: order.id,
      user_id: userId,
      provider: "mercado_pago",
      status: "pending",
      amount: plan.price,
    });

    if (paymentError) {
      throw new Error("Pedido criado, mas houve um erro ao registrar o pagamento.");
    }

    return { orderId: order.id as string };
  });

interface GetOrderInput {
  orderId: string;
}

export const getOrderStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: GetOrderInput) => data)
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: order, error } = await supabase
      .from("orders")
      .select("id,status,delivery_status,amount,plan_id,plans(name,duration_days)")
      .eq("id", data.orderId)
      .single();
    if (error || !order) {
      throw new Error("Pedido não encontrado.");
    }
    return order;
  });
